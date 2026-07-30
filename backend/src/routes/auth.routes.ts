import { Router } from 'express';
import {
  getProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { loginSchema, refreshTokenSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateRequest(registerSchema), registerController);
router.post('/login', validateRequest(loginSchema), loginController);
router.post('/refresh', validateRequest(refreshTokenSchema), refreshTokenController);
router.post('/logout', authenticate, logoutController);

router.get('/me', authenticate, getProfileController);
router.get('/profile', authenticate, getProfileController);

export default router;
