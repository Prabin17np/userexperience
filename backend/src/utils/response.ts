import { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): void => {
  const response: ApiResponse<T> = { success: true, message };
  if (data !== undefined) response.data = data;
  res.status(statusCode).json(response);
};

export const sendCreated = <T>(
  res: Response,
  message: string,
  data?: T
): void => {
  sendSuccess(res, message, data, 201);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  data?: unknown
): void => {
  const response: ApiResponse = { success: false, message };
  if (data !== undefined) response.data = data;
  res.status(statusCode).json(response);
};