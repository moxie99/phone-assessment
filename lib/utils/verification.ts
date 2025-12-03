import crypto from "crypto"

export function generateVerificationCode(): string {
  // Generate a cryptographically secure 6-digit verification code
  // This is more secure than Math.random()
  const randomBytes = crypto.randomBytes(3)
  const code = randomBytes.readUIntBE(0, 3) % 1000000
  return code.toString().padStart(6, "0")
}

export function isVerificationCodeExpired(createdAt: Date): boolean {
  // Verification code expires after 24 hours
  const expirationTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  const now = new Date()
  const timeDiff = now.getTime() - createdAt.getTime()
  return timeDiff > expirationTime
}

