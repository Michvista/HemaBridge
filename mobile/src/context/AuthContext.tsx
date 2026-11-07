import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiClient, setAuthToken } from '../api/client';
import { getSocket, disconnectSocket } from '../api/socket';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.DONOR);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize with the primary dummy donor account on boot
  useEffect(() => {
    quickSwitchRole(UserRole.DONOR).finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password: pass });
      const { accessToken, user: loggedUser } = res.data;
      setToken(accessToken);
      setUser(loggedUser);
      setRole(loggedUser.role);
      setAuthToken(accessToken);
      getSocket(loggedUser.id);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register', payload);
      const { accessToken, user: registeredUser } = res.data;
      setToken(accessToken);
      setUser(registeredUser);
      setRole(registeredUser.role);
      setAuthToken(accessToken);
      getSocket(registeredUser.id);
    } finally {
      setIsLoading(false);
    }
  };

  const quickSwitchRole = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post(`/auth/quick-login/${targetRole}`);
      const { accessToken, user: quickUser } = res.data;
      setToken(accessToken);
      setUser(quickUser);
      setRole(quickUser.role);
      setAuthToken(accessToken);
      getSocket(quickUser.id);
    } catch (err) {
      console.log(`Failed to quick-switch to ${targetRole}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await apiClient.get('/auth/me');
      setUser(res.data);
      setRole(res.data.role);
    } catch (err) {
      console.log('Error refreshing profile:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isLoading,
        login,
        register,
        logout,
        quickSwitchRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
