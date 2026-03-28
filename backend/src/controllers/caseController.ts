import type { Request, Response } from 'express';
import Case from '../models/Case.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Create new case
// @route   POST /api/cases
// @access  Private (Patient/Admin)
export const createCase = async (req: any, res: Response) => {
  try {
    console.log('--- CASE CREATION DIAGNOSTIC ---');
    console.log(`User ${req.user.id} attempting to create case`);
    
    const caseData = req.body;
    
    // Manual check for helpType if it comes as a string from FormData
    if (typeof caseData.helpType === 'string') {
      try {
        caseData.helpType = JSON.parse(caseData.helpType);
      } catch (e) {
        caseData.helpType = [caseData.helpType];
      }
    }

    // Handle multiple document uploads
    const documentUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      console.log(`>> UPLOADING: ${req.files.length} documents to Cloudinary`);
      
      for (const file of req.files) {
        const result: any = await uploadToCloudinary(file.buffer, 'hopebridge/cases');
        documentUrls.push(result.secure_url);
      }
      console.log('>> SUCCESS: All documents uploaded');
    }

    const newCase = await Case.create({
      ...caseData,
      documents: documentUrls,
      createdBy: req.user.id,
    });

    console.log('>> SUCCESS: Case created:', newCase._id);
    res.status(201).json({ success: true, case: newCase });
  } catch (error: any) {
    console.error('XX ERROR in createCase:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all cases
// @route   GET /api/cases
// @access  Public
export const getCases = async (req: Request, res: Response) => {
  try {
    const { status, category, urgent } = req.query;
    let query: any = {};
    
    if (status) query.verificationStatus = status;
    if (urgent) query.isUrgent = urgent === 'true';
    // Add category filter if disease matches or by category list later

    const cases = await Case.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: cases.length, cases });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single case
// @route   GET /api/cases/:id
// @access  Public
export const getCase = async (req: Request, res: Response) => {
  try {
    const caseData = await Case.findById(req.params.id).populate('createdBy', 'name email');
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    res.status(200).json({ success: true, case: caseData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update case
// @route   PUT /api/cases/:id
// @access  Private (Owner/Admin)
export const updateCase = async (req: any, res: Response) => {
  try {
    let caseData = await Case.findById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    // Check ownership
    if (caseData.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update this case' });
    }

    caseData = await Case.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, case: caseData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
