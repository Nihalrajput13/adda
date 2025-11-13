import axios from 'axios';

// --- This is our cache for the API token ---
let apiToken = null;
let tokenExpiresAt = new Date(0);

const BASE_URL = 'https://cpaas.messagecentral.com';

/**
 * --- Step 1: Get Token (from PDF, page 4) ---
 * This function gets a new authToken from Message Central.
 */
const getAuthToken = async () => {
  // If we have a valid token, return it
  if (apiToken && tokenExpiresAt > new Date()) {
    return apiToken;
  }

  // Get credentials from your .env file
  const customerId = process.env.MESSAGE_CENTRAL_CUSTOMER_ID;
  const key = process.env.MESSAGE_CENTRAL_KEY; // This is your Base-64 encoded password

  if (!customerId || !key) {
    console.error('Missing Message Central credentials in .env file');
    throw new Error('OTP service is not configured.');
  }

  try {
    const response = await axios.get(`${BASE_URL}/auth/v1/authentication/token`, {
      params: {
        customerId,
        key,
        scope: 'NEW', // As per documentation
      },
    });

    if (response.data && response.data.token) {
      apiToken = response.data.token;
      // Set expiration for 55 minutes (token is valid for 1 hour)
      tokenExpiresAt = new Date(Date.now() + 55 * 60 * 1000);
      return apiToken;
    } else {
      throw new Error('Failed to get auth token from Message Central');
    }
  } catch (error) {
    console.error('Message Central Auth Error:', error.response?.data || error.message);
    throw new Error('OTP service authentication failed.');
  }
};

/**
 * --- Step 2: Send OTP (from PDF, page 8) ---
 * Calls the Message Central API to send a real SMS.
 * It returns the `verificationId` which we need for the next step.
 */
export const sendVerificationOTP = async (phone) => {
  const token = await getAuthToken();

  try {
    const response = await axios.post(
      `${BASE_URL}/verification/v3/send`,
      null, // No body, params are in the URL
      {
        headers: {
          authToken: token,
        },
        params: {
          countryCode: '91', // Assuming India
          mobileNumber: phone,
          flowType: 'SMS', // As per documentation
          otpLength: 6 // We want a 6-digit OTP
        },
      }
    );

    // Success! Return the data from the API.
    // We especially need the 'verificationId'.
    return response.data.data; // e.g., { verificationId: "xxxx", ... }
  
  } catch (error) {
    console.error('Message Central Send OTP Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to send OTP.');
  }
};

/**
 * --- Step 3: Validate OTP (from PDF, page 9) ---
 * Calls the Message Central API to check if the user's code is correct.
 */
export const validateVerificationOTP = async (verificationId, otpCode) => {
  const token = await getAuthToken();

  try {
    const response = await axios.get(
      `${BASE_URL}/verification/v3/validateOtp`, 
      {
        headers: {
          authToken: token,
        },
        params: {
          verificationId: verificationId,
          code: otpCode, // The 6-digit code from the user
        },
      }
    );

    // Check for success status (from PDF, page 10)
    if (response.data?.data?.verificationStatus === 'VERIFICATION_COMPLETED') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Message Central Validate OTP Error:', error.response?.data || error.message);
    // Handle specific error codes from the PDF (page 28)
    if (error.response?.data?.code === 702) {
      throw new Error('Wrong OTP provided.');
    }
    throw new Error('Failed to validate OTP.');
  }
};