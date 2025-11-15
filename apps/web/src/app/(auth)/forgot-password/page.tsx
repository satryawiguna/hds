import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/organisms/ForgotPasswordForm";
import { AuthLayout } from "@/components/templates/AuthLayout";

export const metadata: Metadata = {
  title: "Forgot Password - HDS",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot password?"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
