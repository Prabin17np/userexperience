"use client";
import RegisterForm from "@/components/auth/RegisterForm";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex">
      {/* Left: image side */}
      <div
  className="hidden xl:block xl:w-1/2 relative bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/photo-165.jpg')",
  }}
>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-white" />
        <div className="absolute bottom-20 left-16 right-16">
         <h2 className="text-4xl font-black text-white">
  Join the movement.
</h2>
         <p className="mt-4 max-w-sm text-white/80">
  Create your account for early access to drops, member pricing, and a community built for athletes.
</p>
        </div>
      </div>

      {/* Right: form side */}
      <div className="w-full xl:w-1/2 flex items-center justify-center bg-white px-6">
        <RegisterForm onOpenLogin={() => router.push("/login")} />
      </div>
    </div>
  );
}