import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Role = 'admin' | 'user';

interface User {
  id: string;
  name: string;
  role: Role;
  systemName?: string;
}

interface AuthContextType {
  currentUser: User;
  toggleRole: () => void;
}

const mockAdmin: User = {
  id: 'admin-1',
  name: 'Global Administrator',
  role: 'admin',
};

const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  role: 'user',
  systemName: 'Sector 4 Residential Unit',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockAdmin);

  const toggleRole = () => {
    setCurrentUser(prev => prev.role === 'admin' ? mockUser : mockAdmin);
  };

  return (
    <AuthContext.Provider value={{ currentUser, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
