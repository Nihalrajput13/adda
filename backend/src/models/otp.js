import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  // --- THIS IS THE CHANGE ---
  // The 'otp' field now stores the 'verificationId' string from the API
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const OTP = mongoose.model('OTP', OTPSchema);

export default OTP;