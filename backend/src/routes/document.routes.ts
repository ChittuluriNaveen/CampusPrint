import { Router } from 'express';
import {
  deleteDocumentController,
  downloadDocumentController,
  getDocumentByIdController,
  getUserDocumentsController,
  previewDocumentController,
  renameDocumentController,
  uploadDocumentController,
} from '../controllers/document.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadSingleDocument } from '../middleware/upload.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { renameDocumentSchema } from '../validators/document.validator';

const router = Router();

router.use(authenticate);

router.post('/upload', uploadSingleDocument, uploadDocumentController);
router.get('/', getUserDocumentsController);
router.get('/:id', getDocumentByIdController);
router.patch('/:id', validateRequest(renameDocumentSchema), renameDocumentController);
router.delete('/:id', deleteDocumentController);
router.get('/:id/download', downloadDocumentController);
router.get('/:id/preview', previewDocumentController);

export default router;
