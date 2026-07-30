import { Router } from 'express';
import { getProfileController } from '../controllers/auth.controller';
import { changePasswordController, updateProfileController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { changePasswordSchema, updateProfileSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfileController);
router.get('/me', getProfileController);

router.patch('/profile', validateRequest(updateProfileSchema), updateProfileController);
router.patch('/password', validateRequest(changePasswordSchema), changePasswordController);

export default router;
