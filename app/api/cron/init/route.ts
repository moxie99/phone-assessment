import { startStatsCronJob } from "@/lib/cron"

// Initialize cron job when this route is called
export async function GET() {
  try {
    startStatsCronJob()
    return Response.json({ 
      message: "Cron job initialized",
      note: "Stats email will be sent every 2 hours automatically."
    })
  } catch (error: any) {
    return Response.json(
      { error: "Failed to initialize cron job", details: error.message },
      { status: 500 }
    )
  }
}

