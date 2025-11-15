"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/lib/store";
import { AUTH_ROUTES, TASK_ROUTES } from "@hds/shared";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { name: "Dashboard", href: AUTH_ROUTES.DASHBOARD },
  { name: "Tasks", href: TASK_ROUTES.LIST },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const pathname = usePathname();

  const handleLogout = React.useCallback(() => {
    console.log("Logout button clicked");
    logoutMutation.mutate();
  }, [logoutMutation]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Happy Day Services
              </h1>
              {/* Navigation */}
              <nav className="flex items-center gap-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href ||
                        (item.href !== AUTH_ROUTES.DASHBOARD &&
                          pathname.startsWith(item.href))
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-gray-800"
                onClick={handleLogout}
                isLoading={logoutMutation.isPending}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
