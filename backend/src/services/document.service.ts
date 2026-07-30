import { Prisma, UserRole } from '@prisma/client';
import path from 'path';
import { prisma } from '../lib/prisma';
import { AppError } from '../services/auth.service';
import { deleteStoredFile, fileExists } from '../utils/storage';
import { DocumentQueryInput } from '../validators/document.validator';

export const uploadDocument = async (userId: string, file: Express.Multer.File) => {
  const document = await prisma.document.create({
    data: {
      userId,
      originalFileName: file.originalname,
      storedFileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      pageCount: 1, // Default 1 page, future PDF processor will extract exact page count
      status: 'ACTIVE',
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'DOCUMENT_UPLOADED',
      entity: 'Document',
      entityId: document.id,
    },
  });

  return document;
};

export const getUserDocuments = async (
  userId: string,
  userRole: UserRole,
  query: DocumentQueryInput
) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const whereClause: Prisma.DocumentWhereInput = {
    deletedAt: null,
    ...(userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN && { userId }),
    ...(query.search && {
      originalFileName: {
        contains: query.search,
        mode: 'insensitive',
      },
    }),
  };

  const [documents, total] = await Promise.all([
    prisma.document.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.document.count({ where: whereClause }),
  ]);

  const pages = Math.ceil(total / limit) || 1;

  return {
    documents,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
};

export const getDocumentById = async (
  documentId: string,
  userId: string,
  userRole: UserRole
) => {
  const document = await prisma.document.findFirst({
    where: { id: documentId, deletedAt: null },
  });

  if (!document) {
    throw new AppError(404, 'Document not found');
  }

  if (
    document.userId !== userId &&
    userRole !== UserRole.ADMIN &&
    userRole !== UserRole.SUPER_ADMIN
  ) {
    throw new AppError(403, 'Access denied: You do not own this document');
  }

  return document;
};

export const renameDocument = async (
  documentId: string,
  userId: string,
  userRole: UserRole,
  newName: string
) => {
  const document = await getDocumentById(documentId, userId, userRole);

  const existingExt = path.extname(document.originalFileName);
  let finalName = newName.trim();
  if (!finalName.endsWith(existingExt)) {
    finalName += existingExt;
  }

  const updatedDocument = await prisma.document.update({
    where: { id: documentId },
    data: { originalFileName: finalName },
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'DOCUMENT_RENAMED',
      entity: 'Document',
      entityId: documentId,
    },
  });

  return updatedDocument;
};

export const deleteDocument = async (
  documentId: string,
  userId: string,
  userRole: UserRole
) => {
  const document = await getDocumentById(documentId, userId, userRole);

  await prisma.document.update({
    where: { id: documentId },
    data: { deletedAt: new Date(), status: 'DELETED' },
  });

  await deleteStoredFile(document.path);

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'DOCUMENT_DELETED',
      entity: 'Document',
      entityId: documentId,
    },
  });
};

export const getDocumentFileForDownload = async (
  documentId: string,
  userId: string,
  userRole: UserRole
) => {
  const document = await getDocumentById(documentId, userId, userRole);

  if (!fileExists(document.path)) {
    throw new AppError(404, 'Document file payload missing on storage disk');
  }

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'DOCUMENT_DOWNLOADED',
      entity: 'Document',
      entityId: documentId,
    },
  });

  return {
    filePath: document.path,
    originalFileName: document.originalFileName,
    mimeType: document.mimeType,
  };
};

export const getDocumentFileForPreview = async (
  documentId: string,
  userId: string,
  userRole: UserRole
) => {
  const document = await getDocumentById(documentId, userId, userRole);

  if (!fileExists(document.path)) {
    throw new AppError(404, 'Document file payload missing on storage disk');
  }

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'DOCUMENT_PREVIEWED',
      entity: 'Document',
      entityId: documentId,
    },
  });

  return {
    filePath: document.path,
    mimeType: document.mimeType,
  };
};
