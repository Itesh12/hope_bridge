import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword,
  updateDetails,
  updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('profileImage'), validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails', protect, upload.single('profileImage'), updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/me', protect, getMe);

export default router;
