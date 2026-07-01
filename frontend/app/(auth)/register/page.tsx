"use client";
import RegisterForm from "@/components/auth/RegisterForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return <RegisterForm onOpenLogin={() => router.push("/login")} />;
}