"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { Alert, AlertDescription } from "@/components/atoms/Alert";
import { useResetPassword } from "@/hooks/useAuth";
import { resetPasswordSchema, ResetPasswordFormData } from "@hds/shared";

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  token,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(resetPasswordSchema as any),
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate({ ...data, token });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {resetPasswordMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {resetPasswordMutation.error instanceof Error &&
            "response" in resetPasswordMutation.error &&
            typeof resetPasswordMutation.error.response === "object" &&
            resetPasswordMutation.error.response !== null &&
            "data" in resetPasswordMutation.error.response &&
            typeof resetPasswordMutation.error.response.data === "object" &&
            resetPasswordMutation.error.response.data !== null &&
            "message" in resetPasswordMutation.error.response.data
              ? String(resetPasswordMutation.error.response.data.message)
              : "Failed to reset password. The link may have expired."}
          </AlertDescription>
        </Alert>
      )}

      {resetPasswordMutation.isSuccess && (
        <Alert variant="success">
          <AlertDescription>
            Password has been reset successfully! Redirecting to login...
          </AlertDescription>
        </Alert>
      )}

      <FormField
        label="New Password"
        id="password"
        type="password"
        placeholder="••••••••"
        required
        error={errors.password?.message}
        {...register("password")}
        disabled={resetPasswordMutation.isSuccess}
      />

      <FormField
        label="Confirm New Password"
        id="confirmPassword"
        type="password"
        placeholder="••••••••"
        required
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
        disabled={resetPasswordMutation.isSuccess}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={resetPasswordMutation.isPending}
        disabled={resetPasswordMutation.isSuccess}
      >
        Reset password
      </Button>
    </form>
  );
};
