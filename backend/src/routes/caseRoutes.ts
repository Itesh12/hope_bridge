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
  upload.fields([
    { name: 'documents', maxCount: 5 },
    { name: 'patientImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]), 
  validateRequest(createCaseSchema), 
  createCase
);
router.put('/:id', 
  protect, 
  upload.fields([
    { name: 'documents', maxCount: 5 },
    { name: 'patientImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]), 
  validateRequest(createCaseSchema), 
  updateCase
);

export default router;
