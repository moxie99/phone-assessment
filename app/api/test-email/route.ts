import { NextRequest, NextResponse } from "next/server"
import { sendVerificationEmail, sendStatsEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_APP_PASSWORD

    if (!gmailUser || !gmailPassword) {
      return NextResponse.json(
        {
          error: "Email configuration missing",
          details: {
            GMAIL_USER: gmailUser ? "✓ Set" : "✗ Missing",
            GMAIL_APP_PASSWORD: gmailPassword ? "✓ Set" : "✗ Missing",
          },
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { type, email, firstName } = body

    if (type === "verification") {
      // Test verification email
      const testCode = "123456"
      const result = await sendVerificationEmail(
        email || gmailUser,
        firstName || "Test User",
        testCode
      )

      if (result.success) {
        return NextResponse.json(
          {
            success: true,
            message: "Test verification email sent successfully",
            sentTo: email || gmailUser,
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          {
            error: "Failed to send test email",
            details: result.error,
          },
          { status: 500 }
        )
      }
    } else if (type === "stats") {
      // Test stats email
      const testStats = {
        totalReservations: 10,
        verifiedReservations: 5,
        unverifiedReservations: 5,
        reservationsLast2Hours: 2,
        topCountries: [
          { country: "Nigeria", count: 5 },
          { country: "United States", count: 3 },
          { country: "United Kingdom", count: 2 },
        ],
      }

      const result = await sendStatsEmail(
        email || process.env.STATS_EMAIL || "adeolusegun1000@gmail.com",
        testStats
      )

      if (result.success) {
        return NextResponse.json(
          {
            success: true,
            message: "Test stats email sent successfully",
            sentTo: email || process.env.STATS_EMAIL || "adeolusegun1000@gmail.com",
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          {
            error: "Failed to send test email",
            details: result.error,
          },
          { status: 500 }
        )
      }
    } else {
      return NextResponse.json(
        { error: "Invalid type. Use 'verification' or 'stats'" },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

