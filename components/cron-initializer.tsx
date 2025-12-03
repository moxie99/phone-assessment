"use client"

import { useEffect } from "react"

// Client component that initializes cron on server via API
export default function CronInitializer() {
  useEffect(() => {
    // Call API route to ensure cron is initialized on page load
    fetch("/api/cron/init", { method: "GET" })
      .catch(() => {
        // Silently handle errors - cron will retry on server restart
      })
  }, [])
  
  return null
}

