"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { Alert, AlertDescription } from "@/components/atoms/Alert";
import { useRegister } from "@/hooks/useAuth";
import { registerSchema, RegisterFormData } from "@hds/shared";
import { AUTH_ROUTES } from "@hds/shared";

export const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(registerSchema as any),
  });

  const registerMutation = useRegister();

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {registerMutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {registerMutation.error instanceof Error &&
            "response" in registerMutation.error &&
            typeof registerMutation.error.response === "object" &&
            registerMutation.error.response !== null &&
            "data" in registerMutation.error.response &&
            typeof registerMutation.error.response.data === "object" &&
            registerMutation.error.response.data !== null &&
            "message" in registerMutation.error.response.data
              ? String(registerMutation.error.response.data.message)
              : "Registration failed. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="First Name"
          id="firstName"
          type="text"
          placeholder="John"
          required
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <FormField
          label="Last Name"
          id="lastName"
          type="text"
          placeholder="Doe"
          required
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

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

      <FormField
        label="Confirm Password"
        id="confirmPassword"
        type="password"
        placeholder="••••••••"
        required
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={registerMutation.isPending}
      >
        Create account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
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
