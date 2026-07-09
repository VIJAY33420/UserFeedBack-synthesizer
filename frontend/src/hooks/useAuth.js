import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  return useMutation({
    mutationFn: api.auth.login,
    onSuccess: (data) => {
      setAuth(data.user || { email: data.email }, data.token);
    },
  });
};

export const useSignup = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  return useMutation({
    mutationFn: api.auth.signup,
    onSuccess: (data) => {
      setAuth(data.user || { name: data.name, email: data.email }, data.token);
    },
  });
};

export const useGoogleLoginMutation = () => {
  const setAuth = useAuthStore(state => state.setAuth);
  return useMutation({
    mutationFn: api.auth.googleLogin,
    onSuccess: (data) => {
      setAuth(data.user || { email: data.email }, data.token);
    },
  });
};

export const useUser = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const setUser = useAuthStore(state => state.setUser);
  
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: api.auth.getMe,
    enabled: isAuthenticated,
  });
};
