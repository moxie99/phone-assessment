"use client"

import { useEffect } from "react"

// Client component that initializes cron on server via API
export default function CronInitializer() {
  useEffect(() => {
    // Call API route to ensure cron is initialized on page load
    fetch("/api/cron/init", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Cron initialization:", data.message || data.error)
      })
      .catch((err) => {
        console.error("Failed to initialize cron-:", err)
      })
  }, [])
  
  return null
}

