/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RegisterData, registerSchema } from "@/app/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRegister } from "@/lib/action/auth.action";
import { useState, useTransition } from "react";

// Props interface
interface RegisterFormProps {
  onOpenLogin: () => void;
}

export default function RegisterForm({ onOpenLogin }: RegisterFormProps) {
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
     mode: "onSubmit",
  });

  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";
  const passwordsMatch = password === confirmPassword;

  const strength = [
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
    password.length > 6,
  ].filter(Boolean).length;
  const strengthColors = ["bg-[#C0392B]", "bg-[#C2410C]", "bg-[#B7950B]", "bg-[#111111]"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const onSubmit = async (data: RegisterData) => {
    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        const res = await handleRegister({
          name: data.name,
          email: data.email,
          password: data.password,
          role: "user",
        });
        if (!res.success) throw new Error(res.message || "Registration failed");

        toast.success("Account created successfully 🌿");
        reset();
        onOpenLogin();
      } catch (err: Error | any) {
        const message = err.message || "Registration failed";
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
          Create Account
        </h1>
        <p className="text-sm text-[#777777]">
          Join us to start shopping
        </p>
      </div>

      {error && (
        <p className="text-sm text-[#C0392B] mb-5 bg-[#FDECEA] py-2.5 px-3.5">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-[#111111]">
            Username
          </label>
          <input
            type="text"
            placeholder="yourname"
            {...register("name")}
            className="w-full border border-[#ccc] px-3.5 py-3 text-sm outline-none focus:border-[#111111] transition-colors"
          />
          {errors.name && (
            <span className="text-xs text-[#C0392B]">{errors.name.message}</span>
          )}
        </div>

        {/* Email */}
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

        {/* Password */}
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

          {password.length > 0 && (
            <div className="mt-1.5 space-y-1.5">
              <div className="h-1 bg-[#eee] overflow-hidden">
                <div
                  className={`${strengthColors[strength - 1] || "bg-[#C0392B]"} h-1 transition-all duration-300`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#777777]">
                Strength:{" "}
                <span className="font-semibold text-[#111111]">
                  {strengthLabels[strength - 1] || "Too weak"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wide text-[#111111]">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full border border-[#ccc] px-3.5 py-3 text-sm outline-none focus:border-[#111111] transition-colors"
          />
          {errors.confirmPassword && (
            <span className="text-xs text-[#C0392B]">{errors.confirmPassword.message}</span>
          )}
          {!passwordsMatch && confirmPassword && (
            <span className="text-xs text-[#C0392B]">Passwords do not match</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || pending || !passwordsMatch}
          className="w-full bg-[#111111] text-white py-3.5 text-sm font-bold uppercase tracking-wide hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || pending ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#eee] text-center">
        <p className="text-sm text-[#777777]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onOpenLogin}
            className="text-[#111111] font-bold uppercase text-xs tracking-wide underline ml-1"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}