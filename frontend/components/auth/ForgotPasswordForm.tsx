/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ForgetPasswordData, forgetPasswordSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRequestPasswordReset } from "@/lib/action/auth.action";
import { useState, useTransition } from "react";

interface ForgotPasswordFormProps {
  onOpenLogin: () => void;
}

export default function ForgotPasswordForm({ onOpenLogin }: ForgotPasswordFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ForgetPasswordData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data: ForgetPasswordData) => {
    setError("");
    startTransition(async () => {
      try {
        const res = await handleRequestPasswordReset(data.email);
        if (!res.success) throw new Error(res.message || "Request failed");

        toast.success("Reset link sent! Check your inbox 📬");
        reset();
        setSent(true);
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
          Forgot Password
        </h1>
        <p className="text-sm text-[#8A8A8A]">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-5">
          <div className="bg-[#F5F5F5] rounded-md py-8 px-6">
            <p className="text-[#111111] font-bold uppercase text-sm tracking-wide">Reset link sent!</p>
            <p className="text-[#8A8A8A] text-sm mt-2">Check your inbox and follow the instructions.</p>
          </div>
          <button
            type="button"
            onClick={onOpenLogin}
            className="w-full bg-[#111111] text-white py-4 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#222222] transition-colors"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <>
          {error && (
            <p className="text-sm text-[#C0392B] mb-5 bg-[#FDECEA] py-2.5 px-3.5 rounded-md">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wide text-[#555555]">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full bg-[#F5F5F5] rounded-md px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#999999] outline-none focus:ring-2 focus:ring-[#C84B11]/40 transition-all"
              />
              {errors.email && (
                <span className="text-xs text-[#C0392B]">{errors.email.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || pending}
              className="w-full bg-[#111111] text-white py-4 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#222222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || pending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-[#8A8A8A]">
              Remember your password?{" "}
              <button
                type="button"
                onClick={onOpenLogin}
                className="text-[#111111] font-bold underline ml-1"
              >
                Back to Login
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
}