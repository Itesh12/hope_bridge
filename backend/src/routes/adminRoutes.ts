import express from 'express';
import { getAdminStats, verifyCase, getAllUsers, getAllCasesAdmin } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protection to all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.patch('/cases/:id/verify', verifyCase);
router.get('/users', getAllUsers);
router.get('/cases', getAllCasesAdmin);

export default router;
