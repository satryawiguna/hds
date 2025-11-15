"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { Alert, AlertDescription } from "@/components/atoms/Alert";
import { useForgotPassword } from "@/hooks/useAuth";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/validators/auth.validations";
import { AUTH_ROUTES } from "@hds/shared";

export const ForgotPasswordForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {forgotPasswordMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {forgotPasswordMutation.error instanceof Error &&
            "response" in forgotPasswordMutation.error &&
            typeof forgotPasswordMutation.error.response === "object" &&
            forgotPasswordMutation.error.response !== null &&
            "data" in forgotPasswordMutation.error.response &&
            typeof forgotPasswordMutation.error.response.data === "object" &&
            forgotPasswordMutation.error.response.data !== null &&
            "message" in forgotPasswordMutation.error.response.data
              ? String(forgotPasswordMutation.error.response.data.message)
              : "Failed to send reset email. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {forgotPasswordMutation.isSuccess && (
        <Alert variant="success">
          <AlertDescription>
            Password reset link has been sent to your email. Please check your
            inbox.
          </AlertDescription>
        </Alert>
      )}

      <FormField
        label="Email"
        id="email"
        type="email"
        placeholder="your@email.com"
        required
        error={errors.email?.message}
        {...register("email")}
        disabled={forgotPasswordMutation.isSuccess}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={forgotPasswordMutation.isPending}
        disabled={forgotPasswordMutation.isSuccess}
      >
        Send reset link
      </Button>

      <p className="text-center text-sm text-gray-600">
        Remember your password?{" "}
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};
