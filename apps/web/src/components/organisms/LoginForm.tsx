"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { Alert, AlertDescription } from "@/components/atoms/Alert";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema, LoginFormData } from "@/validators/auth.validations";
import { AUTH_ROUTES } from "@hds/shared";

export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {loginMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {loginMutation.error instanceof Error &&
            "response" in loginMutation.error &&
            typeof loginMutation.error.response === "object" &&
            loginMutation.error.response !== null &&
            "data" in loginMutation.error.response &&
            typeof loginMutation.error.response.data === "object" &&
            loginMutation.error.response.data !== null &&
            "message" in loginMutation.error.response.data
              ? String(loginMutation.error.response.data.message)
              : "Invalid email or password. Please try again."}
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
      />

      <FormField
        label="Password"
        id="password"
        type="password"
        placeholder="••••••••"
        required
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex items-center justify-between">
        <Link
          href={AUTH_ROUTES.FORGOT_PASSWORD}
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={loginMutation.isPending}
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href={AUTH_ROUTES.REGISTER}
          className="text-blue-600 hover:text-blue-700 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
};
