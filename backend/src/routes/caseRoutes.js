import express from 'express';
import { createCase, getCases, getCase, updateCase } from '../controllers/caseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/', getCases);
router.get('/:id', getCase);
router.post('/', protect, authorize('patient', 'admin'), createCase);
router.put('/:id', protect, updateCase);
export default router;
//# sourceMappingURL=caseRoutes.js.map