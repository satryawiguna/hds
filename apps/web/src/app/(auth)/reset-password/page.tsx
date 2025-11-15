"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/organisms/ResetPasswordForm";
import { AuthLayout } from "@/components/templates/AuthLayout";
import { Alert, AlertDescription } from "@/components/atoms/Alert";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Invalid or missing reset token. Please request a new password reset
          link.
        </AlertDescription>
      </Alert>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Reset password" description="Enter your new password">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </AuthLayout>
  );
}
