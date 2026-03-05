import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Criar conta — Película Sideral",
};

export default function SignupPage() {
  return (
    <AuthCard title="Criar conta" subtitle="Junte-se à Película Sideral">
      <SignupForm />
    </AuthCard>
  );
}
