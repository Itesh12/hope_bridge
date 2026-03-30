import type { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import * as crypto from 'crypto';
import User from '../models/User.js';
import { sendTokenResponse } from '../utils/auth.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    console.log('--- SIGNUP DIAGNOSTIC ---');
    console.log('Target DB:', mongoose.connection.name);
    console.log('Payload Received:', { name, email, role, passwordProvided: !!password });

    // Check if user exists
    let existingUser = await User.findOne({ email });
    console.log('User.findOne result:', existingUser ? `User found (ID: ${existingUser._id})` : 'No user found');

    if (existingUser) {
      console.log('!! REJECTING: User already exists');
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle profile image upload if provided
    let profileImageUrl = '';
    const multerReq = req as any;
    if (multerReq.file) {
      console.log('>> UPLOADING: Profile image to Cloudinary');
      const result: any = await uploadToCloudinary(multerReq.file.buffer);
      profileImageUrl = result.secure_url;
      console.log('>> SUCCESS: Image uploaded:', profileImageUrl);
    }

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage: profileImageUrl,
      role: role || 'donor',
    });

    console.log('>> SUCCESS: User created:', newUser._id);
    sendTokenResponse(newUser, 201, res);
  } catch (error: any) {
    console.error('XX ERROR in register:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log('--- LOGIN DIAGNOSTIC ---');
    console.log('Target DB:', mongoose.connection.name);
    console.log('Attempting login for:', email);

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', !!user);

    if (!user) {
      console.log('!! REJECTING: No user found with this email');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is banned
    if (user.status === 'banned') {
      console.log('!! REJECTING: User is banned');
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password || '');
    console.log('Password Match:', isMatch);

    if (!isMatch) {
      console.log('!! REJECTING: Password mismatch');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('>> SUCCESS: Login granted');
    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    console.error('XX ERROR in login:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with this email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // In production, we would send an email here. 
    // For development, we return the token (or a hypothetical reset URL).
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
    
    console.log('--- FORGOT PASSWORD DIAGNOSTIC ---');
    console.log(`Reset Token for ${user.email}: ${resetToken}`);
    console.log(`Mock Reset URL: ${resetUrl}`);

    res.status(200).json({ 
      success: true, 
      message: 'Password reset token generated (Check console/dev-notes)',
      resetToken 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Get hashed token
    const tokenParam = req.params['resettoken'];
    const token = Array.isArray(tokenParam) ? (tokenParam[0] || "") : (tokenParam || "");

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req: any, res: Response) => {
  try {
    const { name } = req.body;
    
    console.log('--- UPDATE DETAILS DIAGNOSTIC ---');
    console.log(`User ${req.user?.id} requesting update:`, { name });

    // Handle profile image update if provided
    let profileImageUrl = undefined;
    if (req.file) {
      console.log('>> UPDATING: Profile image on Cloudinary');
      const result: any = await uploadToCloudinary(req.file.buffer);
      profileImageUrl = result.secure_url;
    }

    const fieldsToUpdate: any = {};
    if (name) fieldsToUpdate.name = name;
    if (profileImageUrl) fieldsToUpdate.profileImage = profileImageUrl;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    console.log('>> SUCCESS: Profile updated:', user?._id);
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    console.error('XX ERROR in updateDetails:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
