"use client";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return <ForgotPasswordForm onOpenLogin={() => router.push("/login")} />;
}