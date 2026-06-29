import multer from 'multer';
import { Request } from 'express';
import { cloudinary } from '../config/cloudinary';
import { IProductImage } from '../types/product.types';
import AppError from './AppError';

// Use memory storage so files go straight to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only JPEG, PNG, WEBP, and GIF images are allowed', 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 10,                  // max 10 images per product
  },
});

/**
 * Upload a single buffer to Cloudinary.
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder = 'products'
): Promise<IProductImage> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error || !result) {
          return reject(new AppError('Failed to upload image to Cloudinary', 500));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

/**
 * Upload multiple files from a multer request.
 */
export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder = 'products'
): Promise<IProductImage[]> => {
  const uploads = files.map((file) =>
    uploadToCloudinary(file.buffer, folder)
  );
  return Promise.all(uploads);
};

/**
 * Delete an image from Cloudinary by publicId.
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

/**
 * Delete multiple images from Cloudinary.
 */
export const deleteMultipleFromCloudinary = async (
  publicIds: string[]
): Promise<void> => {
  await Promise.all(publicIds.map(deleteFromCloudinary));
};