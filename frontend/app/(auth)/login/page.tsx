"use client";
import LoginForm from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex">
      {/* Left: image side — only shows on larger screens now */}
         <div
  className="hidden xl:block xl:w-1/2 relative bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/photo-165.jpg')",
  }}
>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white" />
        <div className="absolute bottom-16 left-12 right-12">
         <h2 className="text-4xl font-black text-white">
            Step into the future of performance.
          </h2>
          <p className="mt-4 max-w-sm text-white/80">
            Exclusive access to limited drops, professional gear, and a community of athletes who never settle for second best.
          </p>
        </div>
      </div>

      {/* Right: form side — full width until xl */}
      <div className="w-full xl:w-1/2 flex items-center justify-center bg-white px-4">
        <LoginForm
          onOpenRegister={() => router.push("/register")}
          onForgotPassword={() => router.push("/forgot_password")}
        />
      </div>
    </div>
  );
}