import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Nova senha — Película Sideral",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Redefinir senha" subtitle="Escolha sua nova senha">
      <ResetPasswordForm />
    </AuthCard>
  );
}
