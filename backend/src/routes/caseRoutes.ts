import express from 'express';
import { createCase, getCases, getCase, updateCase, getMyCases } from '../controllers/caseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { createCaseSchema } from '../validations/caseValidation.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCases);
router.get('/my', protect, getMyCases);
router.get('/:id', getCase);
router.post('/', 
  protect, 
  authorize('patient', 'admin'), 
  upload.array('documents', 5), 
  validateRequest(createCaseSchema), 
  createCase
);
router.put('/:id', 
  protect, 
  upload.array('documents', 5), 
  validateRequest(createCaseSchema), 
  updateCase
);

export default router;
