import { Router, Request, Response } from 'express';

const router = Router();

const healthHandler = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
  });
};

// API v1 router
const apiV1Router = Router();
apiV1Router.get('/health', healthHandler);

// Mount versioned router
router.use('/v1', apiV1Router);

export { healthHandler, router as apiRouter };
