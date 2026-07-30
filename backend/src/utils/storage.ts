import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
];

export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export const getUploadDirectoryPath = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const targetDir = path.resolve(env.UPLOAD_PATH, year, month);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  return targetDir;
};

export const generateStoredFileName = (originalName: string): string => {
  const ext = path.extname(originalName).toLowerCase();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = crypto.randomBytes(4).toString('hex');
  return `CP_${dateStr}_${randomHex}${ext}`;
};

export const deleteStoredFile = async (filePath: string): Promise<void> => {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(filePath);
    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
    }
  } catch (error) {
    console.error(`Failed to delete stored file at ${filePath}:`, error);
  }
};

export const fileExists = (filePath: string): boolean => {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(filePath);
  return fs.existsSync(absolutePath);
};
