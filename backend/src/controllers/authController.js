import User from '../models/User.js';
import OTP from '../models/OTP.js'; // Your updated OTP model
import jwt from 'jsonwebtoken';
// Import from your 'utils' folder
import { sendVerificationOTP, validateVerificationOTP } from '../utils/smsService.js';


// Helper function to create a token (no change)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Send an OTP to a phone number
 * @route   POST /api/auth/send-otp
 */
export const sendOTP = async (req, res) => {
  const { phone } = req.body;
  
  if (!phone || phone.length !== 10) {
    return res.status(400).json({ message: 'Valid 10-digit phone number is required' });
  }

  try {
    // 1. Call the Message Central API to send the SMS
    const apiResponse = await sendVerificationOTP(phone);
    const { verificationId, timeout } = apiResponse;

    // 2. Set expiration time
    const expiresAt = new Date(Date.now() + (timeout || 300) * 1000);

    // 3. Delete any old OTPs for this number
    await OTP.deleteMany({ phone });

    // 4. Save the new record, storing the verificationId in the 'otp' field
    await OTP.create({
      phone,
      otp: verificationId, // We store verificationId, NOT the 6-digit code
      expiresAt,
    });

    res.status(200).json({ message: 'OTP sent successfully.' });
  
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: error.message || 'Server error while sending OTP' });
  }
};


/**
 * @desc    Register a new user with an OTP
 * @route   POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  // 'otp' is the 6-digit code from the user
  const { name, email, phone, otp, referralCode } = req.body;

  try {
    // 1. Find the local OTP record to get the verificationId
    const otpRecord = await OTP.findOne({
      phone,
      expiresAt: { $gt: new Date() }, // Check it's not expired
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }

    // 2. Call Message Central to validate the OTP
    const isVerified = await validateVerificationOTP(otpRecord.otp, otp);

    if (!isVerified) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // 3. Check if user already exists
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 4. Create new user
    const user = await User.create({ name, email, phone });

    // 5. Mark local OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // 6. Generate token and send response
    const token = generateToken(user._id); // Corrected: use user._id
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};


/**
 * @desc    Login an existing user with an OTP
 * @route   POST /api/auth/login-otp
 */
export const loginWithOTP = async (req, res) => {
  // 'otp' is the 6-digit code from the user
  const { phone, otp } = req.body;

  try {
    // 1. Find the local OTP record to get the verificationId
    const otpRecord = await OTP.findOne({
      phone,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      // --- THIS IS THE FIRST FIX (4G00 -> 400) ---
      return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
    }

    // 2. Call Message Central to validate the OTP
    const isVerified = await validateVerificationOTP(otpRecord.otp, otp);

    if (!isVerified) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // 3. Find the user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register.' });
    }

    // 4. Mark local OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // 5. Generate token and send response
    const token = generateToken(user._id);
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error('Error in loginWithOTP:', error);
    // --- THIS IS THE SECOND FIX (5CH00 -> 500) ---
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};


/**
 * @desc    Get current user's profile
 * @route   GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};