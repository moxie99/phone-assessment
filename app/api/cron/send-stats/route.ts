import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import PhoneReservation from "@/models/PhoneReservation"
import { sendStatsEmail } from "@/lib/email"

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    // Vercel Cron sends authorization header automatically
    // External cron services need to include: Authorization: Bearer {CRON_SECRET}
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    // Allow if CRON_SECRET is not set (for development) or if header matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Also check for Vercel's cron header (if using Vercel Cron)
      const vercelCronHeader = request.headers.get("x-vercel-cron")
      if (!vercelCronHeader) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

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
      console.error("Failed to send stats email:", emailResult.error)
      return NextResponse.json(
        { error: "Failed to send stats email", details: emailResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Stats email sent successfully",
        stats,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error in cron job:", error)
    return NextResponse.json(
      { error: "Failed to process cron job", details: error.message },
      { status: 500 }
    )
  }
}

