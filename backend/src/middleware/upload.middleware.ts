import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { sendError } from '../utils/response';
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  generateStoredFileName,
  getUploadDirectoryPath,
} from '../utils/storage';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = getUploadDirectoryPath();
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const storedName = generateStoredFileName(file.originalname);
    cb(null, storedName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error(`Unsupported file type: ${ext}. Allowed formats: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG.`));
    return;
  }

  cb(null, true);
};

export const uploadSingleDocument = (req: Request, res: Response, next: NextFunction): void => {
  const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
    fileFilter,
  }).single('document');

  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        sendError(res, 400, 'File exceeds maximum limit of 100 MB');
        return;
      }
      sendError(res, 400, `Upload error: ${err.message}`);
      return;
    } else if (err) {
      sendError(res, 400, err.message);
      return;
    }

    if (!req.file) {
      sendError(res, 400, 'No document file attached in request payload under key "document"');
      return;
    }

    next();
  });
};
