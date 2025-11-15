"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/lib/store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Happy Day Services
              </h1>
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
