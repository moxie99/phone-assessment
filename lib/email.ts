import nodemailer from "nodemailer"

// Validate email configuration
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn(
    "⚠️  Gmail credentials not configured. Emails will not be sent. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local"
  )
}

// Create transporter with explicit configuration for better reliability
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Use port 587 (TLS) instead of 465 (SSL) - more reliable
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
})

// Verify transporter configuration (non-blocking, with better error handling)
transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message)
    console.error("   This might be due to:")
    console.error("   1. Network/firewall blocking port 587")
    console.error("   2. Incorrect GMAIL_USER or GMAIL_APP_PASSWORD")
    console.error("   3. Gmail account security settings")
    console.error("   4. Need to enable 'Less secure app access' or use App Password")
    console.error("   Emails will still attempt to send, but may fail.")
  } else {
    console.log("✓ Email transporter is ready to send emails")
  }
})

// Get base URL for email images (logo, etc.)
// Normalizes the URL by removing trailing slashes
function getBaseUrl(baseUrl?: string): string {
  let url: string
  
  // If baseUrl is provided, use it
  if (baseUrl) {
    url = baseUrl
  }
  // Check for explicit environment variable
  else if (process.env.NEXT_PUBLIC_BASE_URL) {
    url = process.env.NEXT_PUBLIC_BASE_URL
  }
  // For Vercel deployments
  else if (process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`
  }
  // For other platforms (Netlify, etc.)
  else if (process.env.URL) {
    url = process.env.URL
  }
  // Fallback to localhost for development
  else {
    url = "http://localhost:3000"
  }
  
  // Remove trailing slash to avoid double slashes in image paths
  return url.replace(/\/+$/, "")
}

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  verificationCode: string,
  baseUrl?: string
) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Verify Your Phone Number Reservation - Quickteller Business",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .logo-container {
              text-align: center;
              padding: 15px 30px;
              background: linear-gradient(135deg, #479FC8 0%, #00425F 100%);
              border-radius: 10px 10px 0 0;
            }
            .logo-container img {
              max-width: 120px;
              height: auto;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              -webkit-user-drag: none;
              pointer-events: none;
            }
            .header {
              background: linear-gradient(135deg, #479FC8 0%, #00425F 100%);
              padding: 20px 30px 30px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
              background-color: #f9fafb;
            }
            .verification-code {
              background-color: #479FC8;
              color: #ffffff;
              padding: 20px;
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 5px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #479FC8;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo-container">
              <img src="${getBaseUrl(baseUrl)}/quickteller.png" alt="Quickteller Business" draggable="false" style="max-width: 120px; height: auto; display: block; margin: 0 auto; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-user-drag: none; pointer-events: none;" />
            </div>
            <div class="header">
              <h1>Verify Your Reservation</h1>
            </div>
            <div class="content">
              <p>Hello ${firstName},</p>
              <p>Thank you for reserving your phone number with Quickteller Business!</p>
              <p>To complete your reservation, please use the verification code below:</p>
              <div class="verification-code">${verificationCode}</div>
              <p>Enter this code on the reservation page to confirm your phone number reservation.</p>
              <p>This code will expire in 24 hours.</p>
              <p>If you didn't make this reservation, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>Best regards,<br>Quickteller Business Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return {
        success: false,
        error: "Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local",
      }
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✓ Verification email sent:", {
      to: email,
      messageId: info.messageId,
    })
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error("❌ Error sending verification email:", {
      to: email,
      error: error.message,
      code: error.code,
      response: error.response,
    })
    return { success: false, error: error.message || error }
  }
}

export async function sendStatsEmail(
  toEmail: string,
  stats: {
    totalReservations: number
    verifiedReservations: number
    unverifiedReservations: number
    reservationsLast2Hours: number
    topCountries: Array<{ country: string; count: number }>
  },
  baseUrl?: string
) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: toEmail,
    subject: "Phone Number Reservation Stats - Quickteller Business",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .logo-container {
              text-align: center;
              padding: 15px 30px;
              background: linear-gradient(135deg, #479FC8 0%, #00425F 100%);
              border-radius: 10px 10px 0 0;
            }
            .logo-container img {
              max-width: 120px;
              height: auto;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              -webkit-user-drag: none;
              pointer-events: none;
            }
            .header {
              background: linear-gradient(135deg, #479FC8 0%, #00425F 100%);
              padding: 20px 30px 30px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
              background-color: #f9fafb;
            }
            .stat-box {
              background-color: #ffffff;
              padding: 20px;
              margin: 15px 0;
              border-radius: 8px;
              border-left: 4px solid #479FC8;
            }
            .stat-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .stat-value {
              font-size: 32px;
              font-weight: bold;
              color: #00425F;
            }
            .country-list {
              list-style: none;
              padding: 0;
            }
            .country-item {
              padding: 10px;
              margin: 5px 0;
              background-color: #ffffff;
              border-radius: 5px;
              display: flex;
              justify-content: space-between;
            }
            .footer {
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo-container">
              <img src="${getBaseUrl(baseUrl)}/quickteller.png" alt="Quickteller Business" draggable="false" style="max-width: 120px; height: auto; display: block; margin: 0 auto; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-user-drag: none; pointer-events: none;" />
            </div>
            <div class="header">
              <h1>Reservation Statistics</h1>
            </div>
            <div class="content">
              <p>Here are the latest statistics for phone number reservations:</p>
              
              <div class="stat-box">
                <div class="stat-label">Total Reservations</div>
                <div class="stat-value">${stats.totalReservations}</div>
              </div>
              
              <div class="stat-box">
                <div class="stat-label">Verified Reservations</div>
                <div class="stat-value">${stats.verifiedReservations}</div>
              </div>
              
              <div class="stat-box">
                <div class="stat-label">Unverified Reservations</div>
                <div class="stat-value">${stats.unverifiedReservations}</div>
              </div>
              
              <div class="stat-box">
                <div class="stat-label">New Reservations (Last 2 Hours)</div>
                <div class="stat-value">${stats.reservationsLast2Hours}</div>
              </div>
              
              <h3 style="color: #00425F; margin-top: 30px;">Top Countries</h3>
              <ul class="country-list">
                ${stats.topCountries
                  .map(
                    (item) => `
                  <li class="country-item">
                    <span>${item.country}</span>
                    <strong>${item.count}</strong>
                  </li>
                `
                  )
                  .join("")}
              </ul>
              
              <p style="margin-top: 20px; font-size: 12px; color: #666;">
                This is an automated report sent every 2 hours.
              </p>
            </div>
            <div class="footer">
              <p>Quickteller Business - Reservation System</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }

  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return {
        success: false,
        error: "Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local",
      }
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("✓ Stats email sent:", {
      to: toEmail,
      messageId: info.messageId,
    })
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error("❌ Error sending stats email:", {
      to: toEmail,
      error: error.message,
      code: error.code,
      response: error.response,
    })
    return { success: false, error: error.message || error }
  }
}

