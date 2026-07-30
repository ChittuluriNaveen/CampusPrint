import { Router } from 'express';
import { getLiveness, getReadiness, getMetrics } from '../controllers/health.controller';

const router = Router();

router.get('/liveness', getLiveness);
router.get('/readiness', getReadiness);
router.get('/metrics', getMetrics);

export default router;
