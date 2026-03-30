import type { Request, Response } from 'express';
import Case from '../models/Case.js';
import User from '../models/User.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalCases = await Case.countDocuments();
    const pendingCases = await Case.countDocuments({ verificationStatus: 'pending' });
    const approvedCases = await Case.countDocuments({ verificationStatus: 'approved' });
    const rejectedCases = await Case.countDocuments({ verificationStatus: 'rejected' });
    const totalUsers = await User.countDocuments();
    
    // Calculate total raised across all cases
    const allCases = await Case.find({}, 'raisedAmount');
    const totalRaised = allCases.reduce((acc, curr) => acc + (curr.raisedAmount || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalCases,
        pendingCases,
        approvedCases,
        rejectedCases,
        totalUsers,
        totalRaised
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify (Approve/Reject) a case
// @route   PATCH /api/admin/cases/:id/verify
// @access  Private (Admin)
export const verifyCase = async (req: Request, res: Response) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (status === 'rejected' && (!rejectionReason || rejectionReason.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const caseData = await Case.findById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    caseData.verificationStatus = status;
    caseData.isVerified = status === 'approved';
    if (status === 'rejected') {
      caseData.rejectionReason = rejectionReason;
    } else {
      caseData.rejectionReason = ''; // Clear if approved
    }

    await caseData.save();

    res.status(200).json({ success: true, case: caseData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (for admin management)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all cases with filter for admin
// @route   GET /api/admin/cases
// @access  Private (Admin)
export const getAllCasesAdmin = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let query: any = {};
    if (status && status !== 'all') query.verificationStatus = status;

    const cases = await Case.find(query).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: cases.length, cases });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status (Ban/Activate)
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['active', 'banned'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot change status of another admin' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete another admin' });
    }

    // Delete all cases created by this user
    await Case.deleteMany({ createdBy: req.params.id as any });
    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User and their cases deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete case
// @route   DELETE /api/admin/cases/:id
// @access  Private (Admin)
export const deleteCase = async (req: Request, res: Response) => {
  try {
    const caseData = await Case.findById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    await caseData.deleteOne();
    res.status(200).json({ success: true, message: 'Case deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user activity (cases created)
// @route   GET /api/admin/users/:id/activity
// @access  Private (Admin)
export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const cases = await Case.find({ createdBy: req.params.id as any }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: cases.length, cases });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
