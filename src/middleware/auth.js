const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please login first.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'doctor_tracker_secure_jwt_secret_dev_key_2026');

    // Handle demo admin token or fallback
    if (decoded.id === 'demo-admin-id' || mongoose.connection.readyState !== 1) {
      req.user = {
        id: decoded.id || 'demo-admin-id',
        name: decoded.name || 'Dr. Admin Administrator',
        email: decoded.email || 'admin@doctortracker.com',
        role: decoded.role || 'admin',
      };
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or has expired.',
      error: error.message,
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
