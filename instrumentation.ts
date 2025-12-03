// This file runs when the Next.js server starts
// It's used to initialize services like cron jobs

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Only run on Node.js runtime (server-side)
    const { startStatsCronJob } = await import("./lib/cron")
    
    console.log("🚀 Server starting - initializing cron job...")
    
    // Small delay to ensure everything is ready
    setTimeout(() => {
      startStatsCronJob()
    }, 3000) // 3 second delay
  }
}

