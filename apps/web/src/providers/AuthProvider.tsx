"use client";

import { useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useMe } from "@/hooks/useAuth";
import { AUTH_ROUTES } from "@hds/shared";

const PUBLIC_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.RESET_PASSWORD,
  AUTH_ROUTES.VERIFY_EMAIL,
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, setRedirectPath } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading } = useMe();

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname?.startsWith(route)
    );

    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        if (pathname && pathname !== "/") {
          setRedirectPath(pathname);
        }
        router.push(AUTH_ROUTES.LOGIN);
      } else if (isAuthenticated && isPublicRoute) {
        router.push(AUTH_ROUTES.DASHBOARD);
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, setRedirectPath]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
