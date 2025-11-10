// backend/src/controllers/authController.js
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/otpGenerator.js';

const normalizePhone = (raw) => {
  if (!raw) return raw;
  return String(raw).replace(/\D/g, '');
};

export const sendOTP = async (req, res) => {
  try {
    const phoneRaw = req.body.phone;
    const phone = normalizePhone(phoneRaw);

    if (!phone || phone.length !== 10) {
      return res.status(400).json({ message: 'Invalid phone number' });
    }

    const otp = generateOTP();

    await OTP.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      createdAt: new Date()
    });

    console.log(`OTP for ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone: rawPhone, otp: rawOtp, name, email, referralCode } = req.body;
    const phone = normalizePhone(rawPhone);
    const otp = String(rawOtp).trim();

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const otpRecord = await OTP.findOne({
      phone,
      otp,
      expiresAt: { $gt: new Date() },
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      const latest = await OTP.findOne({ phone }).sort({ createdAt: -1 }).lean();
      console.log('[verifyOTP] no matching otpRecord, latest:', latest);
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    let user = await User.findOne({ phone });
    if (!user) {
      const userData = { phone };
      if (name) userData.name = name;
      if (email) userData.email = email;
      if (referralCode) userData.referralCode = referralCode;
      user = await User.create(userData);
    } else {
      let changed = false;
      if (name && !user.name) { user.name = name; changed = true; }
      if (email && !user.email) { user.email = email; changed = true; }
      if (referralCode && !user.referralCode) { user.referralCode = referralCode; changed = true; }
      if (changed) await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '30d' });

    res.status(200).json({
      success: true,
      message: 'OTP verified and user created/updated',
      token,
      user: { id: user._id, phone: user.phone, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-__v');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};
