const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Seamless Fallback when MongoDB is not connected locally
    if (mongoose.connection.readyState !== 1) {
      if (email === 'admin@doctortracker.com' && password === 'Admin@123456') {
        const token = jwt.sign(
          {
            id: 'demo-admin-id',
            name: 'Dr. Admin Administrator',
            email: 'admin@doctortracker.com',
            role: 'admin',
          },
          process.env.JWT_SECRET || 'doctor_tracker_secure_jwt_secret_dev_key_2026',
          { expiresIn: '7d' }
        );
        return res.status(200).json({
          success: true,
          token,
          user: {
            id: 'demo-admin-id',
            name: 'Dr. Admin Administrator',
            email: 'admin@doctortracker.com',
            role: 'admin',
          },
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Use admin@doctortracker.com / Admin@123456',
        });
      }
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    if (req.user?.id === 'demo-admin-id' || mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        user: req.user || {
          id: 'demo-admin-id',
          name: 'Dr. Admin Administrator',
          email: 'admin@doctortracker.com',
          role: 'admin',
        },
      });
    }

    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register admin/user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Database connection required for user registration.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'admin',
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
