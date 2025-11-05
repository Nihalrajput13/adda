// backend/src/utils/smsService.js

// Dummy implementation to disable Twilio SMS sending during development or temporarily

export async function sendOTP(phone, otp) {
  console.log(`Twilio disabled: would send OTP ${otp} to phone ${phone}`);
  // Simulate async success
  return Promise.resolve();
}

export async function sendMessage(phone, message) {
  console.log(`Twilio disabled: would send message "${message}" to phone ${phone}`);
  return Promise.resolve();
}
