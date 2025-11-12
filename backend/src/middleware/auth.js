import jwt from 'jsonwebtoken';
// --- Make sure this path to your User model is correct! ---
import User from '../models/User.js'; 

/**
 * This is the middleware that protects your routes
 */
export const authMiddleware = async (req, res, next) => {
  let token;

  // 1. Check if the 'Authorization' header exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token from the header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. --- THIS IS THE LINE THAT FIXES YOUR BUG ---
      // Find the user by the ID in the token and attach them to the request
      // This makes 'req.user' available in your *next* function (the controller)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 5. Success! Continue to the controller (e.g., joinTournament)
      next();

    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};