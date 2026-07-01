"use client";
import LoginForm from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <LoginForm
      onOpenRegister={() => router.push("/register")}
      onForgotPassword={() => router.push("/forgot_password")}
    />
  );
}