import mongoose, { Schema, Document, Model } from "mongoose"

export interface IPhoneReservation extends Document {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  country: string
  photoUrl?: string
  photoFileName?: string
  verificationCode: string
  isVerified: boolean
  verifiedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const PhoneReservationSchema = new Schema<IPhoneReservation>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
    },
    photoFileName: {
      type: String,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Create unique indexes to prevent duplicates at database level
PhoneReservationSchema.index({ email: 1 }, { unique: true })
PhoneReservationSchema.index({ phoneNumber: 1 }, { unique: true })
PhoneReservationSchema.index({ isVerified: 1 })

const PhoneReservation: Model<IPhoneReservation> =
  mongoose.models.PhoneReservation ||
  mongoose.model<IPhoneReservation>("PhoneReservation", PhoneReservationSchema)

export default PhoneReservation

