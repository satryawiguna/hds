"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { AuthLayout } from "@/components/templates/AuthLayout";
import { Alert, AlertDescription } from "@/components/atoms/Alert";
import { Button } from "@/components/atoms/Button";
import { useVerifyEmail } from "@/hooks/useAuth";
import Link from "next/link";
import { AUTH_ROUTES } from "@hds/shared";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    if (
      token &&
      !verifyEmailMutation.isPending &&
      !verifyEmailMutation.isSuccess
    ) {
      verifyEmailMutation.mutate(token);
    }
  }, [token, verifyEmailMutation]);

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Invalid or missing verification token. Please check your email for the
          correct link.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {verifyEmailMutation.isPending && (
        <Alert>
          <AlertDescription>Verifying your email address...</AlertDescription>
        </Alert>
      )}

      {verifyEmailMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {verifyEmailMutation.error instanceof Error &&
            "response" in verifyEmailMutation.error &&
            typeof verifyEmailMutation.error.response === "object" &&
            verifyEmailMutation.error.response !== null &&
            "data" in verifyEmailMutation.error.response &&
            typeof verifyEmailMutation.error.response.data === "object" &&
            verifyEmailMutation.error.response.data !== null &&
            "message" in verifyEmailMutation.error.response.data
              ? String(verifyEmailMutation.error.response.data.message)
              : "Failed to verify email. The link may have expired."}
          </AlertDescription>
        </Alert>
      )}

      {verifyEmailMutation.isSuccess && (
        <>
          <Alert variant="success">
            <AlertDescription>
              Your email has been verified successfully! You can now sign in to
              your account.
            </AlertDescription>
          </Alert>
          <Link href={AUTH_ROUTES.LOGIN}>
            <Button className="w-full">Go to Login</Button>
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verify Email"
      description="We're verifying your email address"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthLayout>
  );
}
