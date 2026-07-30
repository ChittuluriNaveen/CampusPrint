import { Request, Response } from 'express';
import path from 'path';
import { AppError } from '../services/auth.service';
import {
  deleteDocument,
  getDocumentById,
  getDocumentFileForDownload,
  getDocumentFileForPreview,
  getUserDocuments,
  renameDocument,
  uploadDocument,
} from '../services/document.service';
import { sendError, sendSuccess } from '../utils/response';
import { DocumentQueryInput } from '../validators/document.validator';

export const uploadDocumentController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    if (!req.file) {
      sendError(res, 400, 'No document uploaded');
      return;
    }

    const document = await uploadDocument(req.user.id, req.file);
    sendSuccess(res, 201, 'Document uploaded successfully', document);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to upload document');
  }
};

export const getUserDocumentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const query = req.query as unknown as DocumentQueryInput;
    const result = await getUserDocuments(req.user.id, req.user.role, query);
    sendSuccess(res, 200, 'Documents retrieved successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve documents');
  }
};

export const getDocumentByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { id } = req.params;
    const document = await getDocumentById(id, req.user.id, req.user.role);
    sendSuccess(res, 200, 'Document retrieved successfully', document);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve document');
  }
};

export const renameDocumentController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { id } = req.params;
    const { name } = req.body;

    const updatedDocument = await renameDocument(id, req.user.id, req.user.role, name);
    sendSuccess(res, 200, 'Document renamed successfully', updatedDocument);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to rename document');
  }
};

export const deleteDocumentController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { id } = req.params;
    await deleteDocument(id, req.user.id, req.user.role);
    sendSuccess(res, 200, 'Document deleted successfully');
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to delete document');
  }
};

export const downloadDocumentController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { id } = req.params;
    const fileInfo = await getDocumentFileForDownload(id, req.user.id, req.user.role);

    res.download(path.resolve(fileInfo.filePath), fileInfo.originalFileName, err => {
      if (err && !res.headersSent) {
        sendError(res, 500, 'Failed to stream document download');
      }
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to download document');
  }
};

export const previewDocumentController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { id } = req.params;
    const fileInfo = await getDocumentFileForPreview(id, req.user.id, req.user.role);

    res.setHeader('Content-Type', fileInfo.mimeType);
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(path.resolve(fileInfo.filePath), err => {
      if (err && !res.headersSent) {
        sendError(res, 500, 'Failed to stream document preview');
      }
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to preview document');
  }
};
