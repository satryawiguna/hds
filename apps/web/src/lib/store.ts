import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserWithProfileDTO } from "@hds/shared";

interface AuthState {
  user: UserWithProfileDTO | null;
  isAuthenticated: boolean;
  redirectPath: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: UserWithProfileDTO | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setRedirectPath: (path: string | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      redirectPath: null,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setRedirectPath: (path) => set({ redirectPath: path }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          redirectPath: null,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
