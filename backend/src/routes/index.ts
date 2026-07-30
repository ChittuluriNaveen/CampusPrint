import { Request, Response, Router } from 'express';
import adminOrderRoutes from './admin-order.routes';
import adminUserRoutes from './admin-user.routes';
import authRoutes from './auth.routes';
import documentRoutes from './document.routes';
import orderRoutes from './order.routes';
import userRoutes from './user.routes';

const router = Router();

const healthHandler = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};

// API v1 router
const apiV1Router = Router();
apiV1Router.get('/health', healthHandler);
apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/users', userRoutes);
apiV1Router.use('/admin/users', adminUserRoutes);
apiV1Router.use('/documents', documentRoutes);
apiV1Router.use('/orders', orderRoutes);
apiV1Router.use('/admin/orders', adminOrderRoutes);

// Mount versioned router
router.use('/v1', apiV1Router);

export { healthHandler, router as apiRouter };
