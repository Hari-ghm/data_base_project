import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: { employeeId: string; name: string; email: string; password: string; school: string; }) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth token and validate
    const checkAuth = async () => {
      try {
        // TODO: Implement actual auth check with backend
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (employeeId: string, password: string) => {
    // TODO: Implement actual login with backend
    const mockUser = {
      id: '1',
      employeeId,
      name: 'Test User',
      email: 'test@example.com',
      school: 'SCOPE'
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (data: { employeeId: string; name: string; email: string; password: string; school: string; }) => {
    // TODO: Implement actual registration with backend
    console.log('Register:', data);
  };

  const forgotPassword = async (email: string) => {
    // TODO: Implement actual forgot password with backend
    console.log('Forgot password:', email);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}