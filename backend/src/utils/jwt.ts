import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN } from '../config';
import { JwtPayload, TokenPair } from '../types/auth.types';

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const generateTokenPair = (payload: JwtPayload): TokenPair => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
};