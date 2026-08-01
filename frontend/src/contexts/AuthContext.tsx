import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN';
  studentId?: string | null;
  department?: string | null;
  year?: number | null;
  avatar?: string | null;
  mustChangePassword?: boolean;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: 'STUDENT' | 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    studentId?: string;
    department?: string;
    year?: number;
  }) => Promise<User>;
  clearMustChangePassword: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cp_token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('cp_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch current user profile on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('cp_token');
      if (storedToken) {
        try {
          const response = await apiClient.get('/auth/me');
          if (response.data?.data) {
            const userData = response.data.data;
            setUser(userData);
            localStorage.setItem('cp_user', JSON.stringify(userData));
          }
        } catch {
          // Token expired or invalid
          setToken(null);
          setUser(null);
          localStorage.removeItem('cp_token');
          localStorage.removeItem('cp_user');
        }
      }
      setIsLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<User> => {
    const response = await apiClient.post('/auth/login', credentials);
    const data = response.data.data;
    const jwtToken = data?.tokens?.accessToken || data?.token || data?.accessToken;
    const userData = data?.user;

    if (jwtToken && userData) {
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('cp_token', jwtToken);
      localStorage.setItem('cp_user', JSON.stringify(userData));
    }

    return userData;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    studentId?: string;
    department?: string;
    year?: number;
  }): Promise<User> => {
    const response = await apiClient.post('/auth/register', data);
    const responseData = response.data.data;
    const jwtToken = responseData?.tokens?.accessToken || responseData?.token || responseData?.accessToken;
    const userData = responseData?.user || responseData;

    if (jwtToken) {
      setToken(jwtToken);
      setUser(userData);
      localStorage.setItem('cp_token', jwtToken);
      localStorage.setItem('cp_user', JSON.stringify(userData));
    }

    return userData;
  };

  const clearMustChangePassword = () => {
    if (user) {
      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);
      localStorage.setItem('cp_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_user');
    apiClient.post('/auth/logout').catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        clearMustChangePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
