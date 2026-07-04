/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ResetPasswordData, resetPasswordSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/action/auth.action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Password strength
  const password = watch("newPassword") || "";
  const strength = [
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length > 6,
  ].filter(Boolean).length;
  const strengthColors = ["bg-[#C0392B]", "bg-[#C2410C]", "bg-[#B7950B]", "bg-[#111111]"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const onSubmit = async (data: ResetPasswordData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await handleResetPassword(token, data.newPassword);
        if (!res.success) throw new Error(res.message || "Reset failed");

        toast.success("Password reset successfully 🌿");
        reset();
        router.replace("/login");
      } catch (err: Error | any) {
        const message = err.message || "Something went wrong";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto px-10 py-12 sm:px-12 sm:py-16">
      {/* Wordmark */}
      <div className="mb-10">
        <p className="text-lg font-black tracking-[0.15em] text-[#C84B11] uppercase mb-8">
          Solely
        </p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111] mb-2 leading-tight">
          Reset Password
        </h1>
        <p className="text-sm text-[#8A8A8A]">
          Choose a strong new password
        </p>
      </div>

      {error && (
        <p className="text-sm text-[#C0392B] mb-5 bg-[#FDECEA] py-2.5 px-3.5 rounded-md">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wide text-[#555555]">
              New Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-semibold uppercase tracking-wide text-[#999999] hover:text-[#111111] transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("newPassword")}
            className="w-full bg-[#F5F5F5] rounded-md px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#999999] outline-none focus:ring-2 focus:ring-[#C84B11]/40 transition-all"
          />
          {errors.newPassword && (
            <span className="text-xs text-[#C0392B]">{errors.newPassword.message}</span>
          )}

          {/* Strength bar */}
          {password.length > 0 && (
            <div className="mt-1.5 space-y-1.5">
              <div className="h-1 bg-[#eee] rounded-full overflow-hidden">
                <div
                  className={`${strengthColors[strength - 1] || "bg-[#C0392B]"} h-1 rounded-full transition-all duration-300`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#8A8A8A]">
                Strength:{" "}
                <span className="font-semibold text-[#111111]">
                  {strengthLabels[strength - 1] || "Too weak"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wide text-[#555555]">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("confirmNewPassword")}
            className="w-full bg-[#F5F5F5] rounded-md px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#999999] outline-none focus:ring-2 focus:ring-[#C84B11]/40 transition-all"
          />
          {errors.confirmNewPassword && (
            <span className="text-xs text-[#C0392B]">{errors.confirmNewPassword.message}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-[#111111] text-white py-4 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#222222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || pending ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {/* Back to login */}
      <div className="mt-10 text-center">
        <p className="text-sm text-[#8A8A8A]">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-[#111111] font-bold underline ml-1"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}