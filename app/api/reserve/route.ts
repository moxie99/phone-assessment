import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import PhoneReservation from "@/models/PhoneReservation"
import { sendVerificationEmail } from "@/lib/email"
import { generateVerificationCode } from "@/lib/utils/verification"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const formData = await request.formData()
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const country = formData.get("country") as string
    const photo = formData.get("photo") as File

    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !country || !photo) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate Gmail email
    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Only Gmail accounts are permitted" },
        { status: 400 }
      )
    }

    // Check if phone number already exists
    const existingReservation = await PhoneReservation.findOne({ phoneNumber })
    if (existingReservation) {
      return NextResponse.json(
        { error: "This phone number has already been reserved" },
        { status: 400 }
      )
    }

    // Check if email already has a reservation
    const existingEmail = await PhoneReservation.findOne({ email })
    if (existingEmail) {
      return NextResponse.json(
        { error: "This email already has a reservation" },
        { status: 400 }
      )
    }

    // Handle photo upload - convert to base64 for storage
    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Photo = buffer.toString("base64")
    const photoDataUrl = `data:${photo.type};base64,${base64Photo}`

    // Generate verification code
    const verificationCode = generateVerificationCode()

    // Create reservation
    const reservation = new PhoneReservation({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phoneNumber,
      country,
      photoUrl: photoDataUrl,
      photoFileName: photo.name,
      verificationCode,
      isVerified: false,
    })

    await reservation.save()

    // Get base URL from request for email images
    const protocol = request.headers.get("x-forwarded-proto") || "http"
    const host = request.headers.get("host") || "localhost:3000"
    const baseUrl = `${protocol}://${host}`

    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      firstName,
      verificationCode,
      baseUrl
    )

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error)
      // Still return success but log the error
    }

    return NextResponse.json(
      {
        success: true,
        message: "Reservation created. Please check your email for verification code.",
        reservationId: reservation._id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating reservation:", error)
    return NextResponse.json(
      { error: "Failed to create reservation", details: error.message },
      { status: 500 }
    )
  }
}

