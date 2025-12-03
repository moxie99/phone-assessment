import cron from "node-cron"
import { sendStatsEmail } from "./email"
import connectDB from "./mongodb"
import PhoneReservation from "@/models/PhoneReservation"

async function sendStatsReport() {
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

    if (emailResult.success) {
      console.log("✓ Stats email sent successfully at", new Date().toISOString())
      console.log("  Sent to:", process.env.STATS_EMAIL || "adeolusegun1000@gmail.com")
    } else {
      console.error("❌ Failed to send stats email:", emailResult.error)
      console.error("  Attempted to send to:", process.env.STATS_EMAIL || "adeolusegun1000@gmail.com")
    }
  } catch (error) {
    console.error("Error in stats cron job:", error)
  }
}

// Schedule to run every 2 hours
// Cron expression: "0 */2 * * *" means "at minute 0 of every 2nd hour"
export function startStatsCronJob() {
  // Prevent multiple initializations
  if ((global as any).cronJobStarted) {
    return
  }

  // Run every 2 hours
  cron.schedule("0 */2 * * *", () => {
    console.log("Running stats cron job at", new Date().toISOString())
    sendStatsReport()
  })

  ;(global as any).cronJobStarted = true
  console.log("✓ Stats cron job scheduled to run every 2 hours")
  console.log("  Next run will be at the next 2-hour interval (e.g., 00:00, 02:00, 04:00, etc.)")
  
  // Run immediately on initialization
  console.log("  Running initial stats report now...")
  sendStatsReport()
}

// Note: Cron job is initialized via API route /api/cron/init
// This is called automatically when the app loads via CronInitializer component

