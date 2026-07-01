import { z } from "zod";

const emailField = z.string().email("Enter a valid email");

const passwordField = z.string()
  .min(8, "Minimum 8 characters")
  .max(100);

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterData = z.infer<typeof registerSchema>;

export const forgetPasswordSchema = z.object({
  email: emailField,
});

export type ForgetPasswordData = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z.object({
  newPassword: passwordField,
  confirmNewPassword: passwordField,
}).refine((v) => v.newPassword === v.confirmNewPassword, {
  path: ["confirmNewPassword"],
  message: "Passwords do not match",
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;