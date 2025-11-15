import { Metadata } from "next";
import { RegisterForm } from "@/components/organisms/RegisterForm";
import { AuthLayout } from "@/components/templates/AuthLayout";

export const metadata: Metadata = {
  title: "Register - HDS",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      description="Get started with HDS"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
