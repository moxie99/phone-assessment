import mongoose, { Schema, Document, Model } from "mongoose"

export interface IVerificationAttempt extends Document {
  email: string
  ipAddress: string
  attempts: number
  lastAttempt: Date
  lockedUntil?: Date
  createdAt: Date
  updatedAt: Date
}

const VerificationAttemptSchema = new Schema<IVerificationAttempt>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastAttempt: {
      type: Date,
      default: Date.now,
    },
    lockedUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// TTL index to auto-delete old attempts after 24 hours
VerificationAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

const VerificationAttempt: Model<IVerificationAttempt> =
  mongoose.models.VerificationAttempt ||
  mongoose.model<IVerificationAttempt>("VerificationAttempt", VerificationAttemptSchema)

export default VerificationAttempt

