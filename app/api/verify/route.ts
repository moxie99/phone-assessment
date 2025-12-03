import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import PhoneReservation from "@/models/PhoneReservation"
import VerificationAttempt from "@/models/VerificationAttempt"
import { isVerificationCodeExpired } from "@/lib/utils/verification"

function getClientIP(request: NextRequest): string {
  // Get client IP address for rate limiting
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  return forwarded?.split(",")[0] || realIP || "unknown"
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, verificationCode } = body
    const clientIP = getClientIP(request)

    if (!email || !verificationCode) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      )
    }

    // Rate limiting: Check for too many failed attempts
    const attemptRecord = await VerificationAttempt.findOne({
      $or: [{ email: email.toLowerCase() }, { ipAddress: clientIP }],
    })

    if (attemptRecord) {
      // Check if account is locked
      if (attemptRecord.lockedUntil && attemptRecord.lockedUntil > new Date()) {
        const minutesLeft = Math.ceil(
          (attemptRecord.lockedUntil.getTime() - Date.now()) / 60000
        )
        return NextResponse.json(
          {
            error: `Too many failed attempts. Account locked for ${minutesLeft} more minute(s).`,
          },
          { status: 429 }
        )
      }

      // Reset lock if expired
      if (attemptRecord.lockedUntil && attemptRecord.lockedUntil <= new Date()) {
        attemptRecord.attempts = 0
        attemptRecord.lockedUntil = undefined
        await attemptRecord.save()
      }
    }

    // Find reservation by email
    const reservation = await PhoneReservation.findOne({
      email: email.toLowerCase(),
    })

    if (!reservation) {
      // Don't reveal if email exists or not (security best practice)
      return NextResponse.json(
        { error: "Invalid email or verification code" },
        { status: 400 }
      )
    }

    if (reservation.isVerified) {
      return NextResponse.json(
        { error: "This reservation has already been verified" },
        { status: 400 }
      )
    }

    // Check if verification code is expired
    if (isVerificationCodeExpired(reservation.createdAt)) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      )
    }

    // Verify code
    const isCodeValid = reservation.verificationCode === verificationCode

    if (!isCodeValid) {
      // Track failed attempt
      if (attemptRecord) {
        attemptRecord.attempts += 1
        attemptRecord.lastAttempt = new Date()

        // Lock after 5 failed attempts for 30 minutes
        if (attemptRecord.attempts >= 5) {
          attemptRecord.lockedUntil = new Date(Date.now() + 30 * 60 * 1000)
        }

        await attemptRecord.save()
      } else {
        // Create new attempt record
        await VerificationAttempt.create({
          email: email.toLowerCase(),
          ipAddress: clientIP,
          attempts: 1,
          lastAttempt: new Date(),
        })
      }

      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      )
    }

    // Success - clear any attempt records
    if (attemptRecord) {
      await VerificationAttempt.deleteOne({ _id: attemptRecord._id })
    }

    // Update reservation as verified
    reservation.isVerified = true
    reservation.verifiedAt = new Date()
    await reservation.save()

    return NextResponse.json(
      {
        success: true,
        message: "Phone number reservation verified successfully!",
        reservation: {
          id: reservation._id,
          firstName: reservation.firstName,
          lastName: reservation.lastName,
          phoneNumber: reservation.phoneNumber,
          country: reservation.country,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error verifying reservation:", error)
    return NextResponse.json(
      { error: "Failed to verify reservation", details: error.message },
      { status: 500 }
    )
  }
}

