import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/store";
import {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from "@/validators/auth.validations";
import {
  ApiResponse,
  LoginResponseDTO,
  UserWithProfileDTO,
  API_ENDPOINTS,
  AUTH_ROUTES,
  AUTH_QUERY_KEYS,
} from "@hds/shared";

export const useLogin = () => {
  const {
    setUser,
    setAuthenticated,
    redirectPath,
    setRedirectPath,
    setTokens,
  } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.LOGIN,
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post<ApiResponse<LoginResponseDTO>>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );
      return response.data.data!;
    },
    onSuccess: (data) => {
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      setUser(data.user);
      setAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ME });

      const targetPath = redirectPath || AUTH_ROUTES.DASHBOARD;
      setRedirectPath(null);
      router.push(targetPath);
    },
  });
};

export const useRegister = () => {
  const { setUser, setAuthenticated, setTokens } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.REGISTER,
    mutationFn: async (data: RegisterFormData) => {
      const response = await apiClient.post<ApiResponse<LoginResponseDTO>>(
        API_ENDPOINTS.AUTH.REGISTER,
        {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }
      );
      return response.data.data!;
    },
    onSuccess: (data) => {
      // Store tokens if registration returns them
      if (data.tokens) {
        setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      }
      setUser(data.user);
      setAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.ME });
      router.push(AUTH_ROUTES.DASHBOARD);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.LOGOUT,
    mutationFn: async () => {
      try {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      } catch (error) {
        console.warn(
          "Logout API call failed, but continuing with local logout",
          error
        );
      }
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      router.push(AUTH_ROUTES.LOGIN);
    },
    onError: () => {
      logout();
      queryClient.clear();
      router.push(AUTH_ROUTES.LOGIN);
    },
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.FORGOT_PASSWORD,
    mutationFn: async (data: ForgotPasswordFormData) => {
      const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        data
      );
      return response.data;
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.RESET_PASSWORD,
    mutationFn: async ({
      token,
      ...data
    }: ResetPasswordFormData & { token: string }) => {
      const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        {
          token,
          password: data.password,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      router.push(AUTH_ROUTES.LOGIN);
    },
  });
};

export const useVerifyEmail = () => {
  const router = useRouter();

  return useMutation({
    mutationKey: AUTH_QUERY_KEYS.VERIFY_EMAIL,
    mutationFn: async (token: string) => {
      const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        { token }
      );
      return response.data;
    },
    onSuccess: () => {
      router.push(AUTH_ROUTES.LOGIN);
    },
  });
};

export const useMe = () => {
  const { setUser, setAuthenticated, isAuthenticated } = useAuthStore();

  const query = useQuery({
    queryKey: AUTH_QUERY_KEYS.ME,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<UserWithProfileDTO>>(
        API_ENDPOINTS.USER.ME
      );
      return response.data.data!;
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Use useEffect to update state based on query results
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
      setAuthenticated(true);
    } else if (query.isError) {
      setUser(null);
      setAuthenticated(false);
    }
  }, [query.data, query.isError, setUser, setAuthenticated]);

  return query;
};
