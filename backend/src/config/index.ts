
import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : 5000;

export const MONGODB_URI: string =
  process.env.MONGODB_URI ||
  "mongodb+srv://prabin17np_db_user:i9cWDQ3nNFYLgnDC@cluster0.nhjtxqi.mongodb.net/ecommerce?appName=Cluster0";

export const JWT_SECRET: string = process.env.JWT_SECRET || "mysecretkey";

// Split into access + refresh using same secret as fallback
export const JWT_ACCESS_SECRET: string =
  process.env.JWT_ACCESS_SECRET || JWT_SECRET;

export const JWT_REFRESH_SECRET: string =
  process.env.JWT_REFRESH_SECRET || JWT_SECRET + "_refresh";

export const JWT_ACCESS_EXPIRES_IN: string =
  process.env.JWT_ACCESS_EXPIRES_IN || "15m";

export const JWT_REFRESH_EXPIRES_IN: string =
  process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export const CLOUDINARY_CLOUD_NAME: string =
  process.env.CLOUDINARY_CLOUD_NAME || "";

export const CLOUDINARY_API_KEY: string =
  process.env.CLOUDINARY_API_KEY || "";

export const CLOUDINARY_API_SECRET: string =
  process.env.CLOUDINARY_API_SECRET || "";

export const EMAIL_USER: string = process.env.EMAIL_USER || "";

export const EMAIL_PASS: string = process.env.EMAIL_PASS || "";

export const FRONTEND_URL: string =
  process.env.FRONTEND_URL || "http://localhost:3000";