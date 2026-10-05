import { createContext, useContext, useState } from 'react';
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
  setRole: (role: Role) => void;
}

const mockAdmin: User = {
  id: 'admin-1',
  name: 'PPCB & MC Chandigarh Admin',
  role: 'admin',
};

const mockUser: User = {
  id: 'user-1',
  name: 'Gurpreet Singh',
  role: 'user',
  systemName: 'Sector 35-B Residential Grid, Chandigarh',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockAdmin);

  const toggleRole = () => {
    setCurrentUser(prev => prev.role === 'admin' ? mockUser : mockAdmin);
  };

  const setRole = (role: Role) => {
    setCurrentUser(role === 'admin' ? mockAdmin : mockUser);
  };

  return (
    <AuthContext.Provider value={{ currentUser, toggleRole, setRole }}>
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
