import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import PhoneReservation from "@/models/PhoneReservation"
import { sendStatsEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get all reservations
    const totalReservations = await PhoneReservation.countDocuments()

    // Get verified reservations
    const verifiedReservations = await PhoneReservation.countDocuments({
      isVerified: true,
    })

    // Get unverified reservations
    const unverifiedReservations = totalReservations - verifiedReservations

    // Get reservations from last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const reservationsLast2Hours = await PhoneReservation.countDocuments({
      createdAt: { $gte: twoHoursAgo },
    })

    // Get top countries
    const countryStats = await PhoneReservation.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          country: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ])

    const stats = {
      totalReservations,
      verifiedReservations,
      unverifiedReservations,
      reservationsLast2Hours,
      topCountries: countryStats,
    }

    // Send stats email
    const emailResult = await sendStatsEmail(
      process.env.STATS_EMAIL || "iswdesignteam@gmail.com",
      stats
    )

    if (!emailResult.success) {
      return NextResponse.json(
        {
          error: "Failed to send stats email",
          details: emailResult.error,
          stats,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Stats email sent successfully",
        sentTo: process.env.STATS_EMAIL || "iswdesignteam@gmail.com",
        stats,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error sending stats email:", error)
    return NextResponse.json(
      { error: "Failed to send stats email", details: error.message },
      { status: 500 }
    )
  }
}

