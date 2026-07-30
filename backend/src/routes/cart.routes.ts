import { Router } from 'express';
import {
  addToCartController,
  checkoutPreviewController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { addToCartSchema, checkoutPreviewSchema, updateCartItemSchema } from '../validators/cart.validator';

const router = Router();

router.use(authenticate);

router.get('/', getCartController);
router.post('/', validateRequest(addToCartSchema), addToCartController);
router.delete('/', clearCartController);

router.post('/items', validateRequest(addToCartSchema), addToCartController);
router.put('/items/:id', validateRequest(updateCartItemSchema), updateCartItemController);
router.delete('/items/:id', removeCartItemController);

router.post('/checkout/preview', validateRequest(checkoutPreviewSchema), checkoutPreviewController);

export default router;
