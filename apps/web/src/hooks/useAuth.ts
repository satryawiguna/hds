import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useAuthStore } from '../lib/store';
import { LoginFormData, RegisterFormData } from '../lib/validations';

interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export const useLogin = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
    },
  });
};

export const useRegister = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();

  return () => {
    logout();
  };
};
