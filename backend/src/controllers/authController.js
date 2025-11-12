import User from '../models/User.js';
import OTP from '../models/OTP.js'; // Assuming your OTP model is OTP.js
import jwt from 'jsonwebtoken';

// Helper function to create a token
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
    // 1. Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${phone}: ${otpCode}`); // Log OTP to terminal for testing

    // 2. Set expiration time (e.g., 5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 3. Delete any old OTPs for this number
    await OTP.deleteMany({ phone });

    // 4. Save the new OTP
    const newOTP = new OTP({
      phone,
      otp: otpCode,
      expiresAt,
    });
    await newOTP.save();

    // In a real app, you would send this via an SMS gateway
    res.status(200).json({ message: 'OTP sent successfully (check backend terminal)' });
  
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
};


/**
 * @desc    Register a new user with an OTP
 * @route   POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  const { name, email, phone, otp, referralCode } = req.body;

  try {
    // 1. Find the OTP
    const otpRecord = await OTP.findOne({
      phone,
      otp,
      expiresAt: { $gt: new Date() }, // Check it's not expired
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // 2. Check if user already exists (by phone OR email)
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 3. Create new user
    const user = await User.create({
      name,
      email,
      phone,
      // Add referralCode logic here if you have it
    });

    // 4. Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // 5. Generate token and send response
    const token = generateToken(user._id);
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
    res.status(500).json({ message: 'Server error during registration' });
  }
};


/**
 * @desc    Login an existing user with an OTP
 * @route   POST /api/auth/login-otp
 */
export const loginWithOTP = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    // 1. Find the OTP
    const otpRecord = await OTP.findOne({
      phone,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // 2. Find the user
    const user = await User.findOne({ phone });
    if (!user) {
      // This is the fix! We don't create a user, we send an error.
      return res.status(404).json({ message: 'User not found. Please register.' });
    }

    // 3. Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // 4. Generate token and send response
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
    res.status(500).json({ message: 'Server error during login' });
  }
};


/**
 * @desc    Get current user's profile
 * @route   GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  // req.user is attached by the authMiddleware
  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};