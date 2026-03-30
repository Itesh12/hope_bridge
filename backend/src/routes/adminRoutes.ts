import express from 'express';
import { 
  getAdminStats, 
  verifyCase, 
  getAllUsers, 
  getAllCasesAdmin, 
  updateUserStatus, 
  deleteUser, 
  deleteCase, 
  getUserActivity 
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protection to all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.patch('/cases/:id/verify', verifyCase);
router.delete('/cases/:id', deleteCase);
router.get('/cases', getAllCasesAdmin);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/users/:id/activity', getUserActivity);

export default router;
