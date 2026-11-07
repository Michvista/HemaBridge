import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { apiClient, setAuthToken } from '../api/client';
import { getSocket, disconnectSocket } from '../api/socket';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  login: (token: string, user: User) => void;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => Promise<void>;
  switchPersona: (persona: 'donor' | 'advocate' | 'hospital') => Promise<void>;
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
  const [showIntro, setShowIntro] = useState<boolean>(false);

  // Initialize with the primary dummy donor account on boot
  useEffect(() => {
    quickSwitchRole(UserRole.DONOR).finally(() => setIsLoading(false));
  }, []);

  const login = (authToken: string, loggedUser: User) => {
    setToken(authToken);
    setUser(loggedUser);
    setRole(loggedUser.role);
    setAuthToken(authToken);
    setShowIntro(false);
    getSocket(loggedUser.id);
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/register', payload);
      const { accessToken, user: registeredUser } = res.data;
      login(accessToken, registeredUser);
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
      setShowIntro(false);
      getSocket(quickUser.id);
    } catch (err) {
      console.log(`Failed to quick-switch to ${targetRole}:`, err);
      // Fallback local mock user so offline testing works seamlessly
      const fallbackUser: User = {
        id: targetRole === UserRole.DONOR ? 'mock-donor' : targetRole === UserRole.ADVOCATE ? 'mock-advocate' : 'mock-hospital',
        name: targetRole === UserRole.DONOR ? 'Amara Miller' : targetRole === UserRole.ADVOCATE ? 'Bolanle Adebayo' : 'LUTH Lagos',
        email: `${targetRole}@hemabridge.com`,
        phone: '+234 803 123 4567',
        role: targetRole,
      };
      setUser(fallbackUser);
      setRole(targetRole);
      setShowIntro(false);
    } finally {
      setIsLoading(false);
    }
  };

  const switchPersona = async (persona: 'donor' | 'advocate' | 'hospital') => {
    const map: Record<string, UserRole> = {
      donor: UserRole.DONOR,
      advocate: UserRole.ADVOCATE,
      hospital: UserRole.HOSPITAL,
    };
    await quickSwitchRole(map[persona]);
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
    setShowIntro(true);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isLoading,
        showIntro,
        setShowIntro,
        login,
        register,
        logout,
        quickSwitchRole,
        switchPersona,
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
