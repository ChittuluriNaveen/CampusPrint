import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import {
  addItemToCart,
  clearUserCart,
  generateCheckoutPreview,
  getUserCartSummary,
  removeCartItem,
  updateCartItemQuantity,
} from '../services/cart.service';
import { sendError, sendSuccess } from '../utils/response';

export const getCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const cart = await getUserCartSummary(req.user.id);
    sendSuccess(res, 200, 'Shopping cart retrieved successfully', cart);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve shopping cart');
  }
};

export const addToCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const cart = await addItemToCart(req.user.id, req.body);
    sendSuccess(res, 201, 'Item added to shopping cart successfully', cart);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to add item to shopping cart');
  }
};

export const updateCartItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const cart = await updateCartItemQuantity(req.user.id, id, req.body);
    sendSuccess(res, 200, 'Cart item updated successfully', cart);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to update cart item');
  }
};

export const removeCartItemController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const cart = await removeCartItem(req.user.id, id);
    sendSuccess(res, 200, 'Item removed from shopping cart', cart);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to remove item from shopping cart');
  }
};

export const clearCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const cart = await clearUserCart(req.user.id);
    sendSuccess(res, 200, 'Shopping cart cleared successfully', cart);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to clear shopping cart');
  }
};

export const checkoutPreviewController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const preview = await generateCheckoutPreview(req.user.id, req.body);
    sendSuccess(res, 200, 'Checkout preview generated successfully', preview);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to generate checkout preview');
  }
};
