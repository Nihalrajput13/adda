import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

export const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 1. Verifies the token using your .env key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 2. Finds the user and attaches them to req.user
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 3. Continues to your controller (e.g., getBalance)
      next();

    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};