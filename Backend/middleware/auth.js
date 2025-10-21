import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || user.accountStatus !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (user && user.accountStatus === 'active') {
      req.user = {
        userId: decoded.userId,
        username: user.username,
        email: user.email
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user info
    req.user = null;
    next();
  }
};

// Admin role middleware
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Add user role to request for use in routes
    req.user.role = user.role;
    req.user.permissions = user.permissions;

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

// Super admin role middleware
export const requireSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Super admin access required'
      });
    }

    req.user.role = user.role;
    req.user.permissions = user.permissions;

    next();
  } catch (error) {
    console.error('Super admin check error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

// Permission-based middleware
export const requirePermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const user = await User.findById(req.user.userId);
      if (!user || !user.hasPermission(permission)) {
        return res.status(403).json({
          success: false,
          message: `Permission '${permission}' required`
        });
      }

      req.user.role = user.role;
      req.user.permissions = user.permissions;

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};
