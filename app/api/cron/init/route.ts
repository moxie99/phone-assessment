import { startStatsCronJob } from "@/lib/cron"

// Initialize cron job when this route is called
export async function GET() {
  try {
    startStatsCronJob()
    return Response.json({ 
      message: "Cron job initialized",
      note: "Stats email will be sent every 5 minutes. An initial email has been sent now."
    })
  } catch (error: any) {
    console.error("Failed to initialize cron job:", error)
    return Response.json(
      { error: "Failed to initialize cron job", details: error.message },
      { status: 500 }
    )
  }
}

