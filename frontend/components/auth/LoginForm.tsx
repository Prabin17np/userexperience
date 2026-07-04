/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LoginData, loginSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useTransition } from "react";

interface LoginFormProps {
  onOpenRegister: () => void;
  onForgotPassword: () => void;
}

export default function LoginForm({ onOpenRegister, onForgotPassword }: LoginFormProps) {
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setError("");
    startTransition(async () => {
      try {
        await login({ email: data.email, password: data.password });
        toast.success("Login successful 🌿");

        const role = useAuthStore.getState().user?.role;
        if (role === "admin") return window.location.replace("/admin/add");
        return window.location.replace("/");
      } catch (err: Error | any) {
        const message = err.message || "Login failed";
        setError(message);
        toast.error(message);
      }
    });
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto px-10 py-12 sm:px-12 sm:py-14">
      {/* Wordmark */}
      <div className="mb-10">
        <p className="text-lg font-black tracking-[0.15em] text-[#C84B11] uppercase mb-8">
          Solely
        </p>
       <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111111] mb-2 leading-tight">
  Welcome Back
</h1>
        <p className="text-sm text-[#8A8A8A]">
          Login to your premium account
        </p>
      </div>

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

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wide text-[#555555]">
              Password
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
            {...register("password")}
            className="w-full bg-[#F5F5F5] rounded-md px-4 py-3.5 text-sm text-[#111111] placeholder:text-[#999999] outline-none focus:ring-2 focus:ring-[#C84B11]/40 transition-all"
          />
          {errors.password && (
            <span className="text-xs text-[#C0392B]">{errors.password.message}</span>
          )}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-semibold uppercase tracking-wide text-[#999999] hover:text-[#111111] underline transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-[#111111] text-white py-4 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#222222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || pending ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-10 text-center">
        <p className="text-sm text-[#8A8A8A]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onOpenRegister}
            className="text-[#111111] font-bold underline ml-1"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}