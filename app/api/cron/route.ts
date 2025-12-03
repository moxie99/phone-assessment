import { startStatsCronJob } from "@/lib/cron"

// Initialize cron job when this route is called
if (typeof window === "undefined") {
  startStatsCronJob()
}

export async function GET() {
  return Response.json({ message: "Cron job initialized - Stats email will be sent every 2 hours" })
}

