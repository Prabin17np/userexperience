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
    <div className="bg-white w-full max-w-md mx-auto px-8 py-10 sm:px-10 sm:py-12">
      {/* Wordmark */}
      <div className="mb-8">
        <p className="text-xl font-black tracking-tight text-[#111111] uppercase mb-6">
          Solely
        </p>
        <h1 className="text-2xl font-black uppercase tracking-tight text-[#111111] mb-1">
          Log In
        </h1>
        <p className="text-sm text-[#777777]">
          Sign in to access your account
        </p>
      </div>

      {error && (
        <p className="text-sm text-[#C0392B] mb-5 bg-[#FDECEA] py-2.5 px-3.5">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-[#111111]">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="w-full border border-[#ccc] px-3.5 py-3 text-sm outline-none focus:border-[#111111] transition-colors"
          />
          {errors.email && (
            <span className="text-xs text-[#C0392B]">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wide text-[#111111]">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-semibold uppercase tracking-wide text-[#777777] hover:text-[#111111]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="w-full border border-[#ccc] px-3.5 py-3 text-sm outline-none focus:border-[#111111] transition-colors"
          />
          {errors.password && (
            <span className="text-xs text-[#C0392B]">{errors.password.message}</span>
          )}
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-semibold uppercase tracking-wide text-[#777777] hover:text-[#111111] underline"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="w-full bg-[#111111] text-white py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || pending ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#eee] text-center">
        <p className="text-sm text-[#777777]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onOpenRegister}
            className="text-[#111111] font-bold uppercase text-xs tracking-wide underline ml-1"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}