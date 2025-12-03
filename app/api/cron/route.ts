// This file is used to initialize the cron job when the server starts
import { startStatsCronJob } from "@/lib/cron"

// Initialize cron job
if (typeof window === "undefined") {
  startStatsCronJob()
}

export async function GET() {
  return Response.json({ message: "Cron job initialized" })
}

