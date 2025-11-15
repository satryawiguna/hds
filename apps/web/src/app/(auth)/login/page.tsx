import { Metadata } from "next";
import { LoginForm } from "@/components/organisms/LoginForm";
import { AuthLayout } from "@/components/templates/AuthLayout";

export const metadata: Metadata = {
  title: "Login - HDS",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
}
