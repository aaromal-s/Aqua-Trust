import { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './authContextDef';
import type { User, Role } from './authContextDef';

export type { User, Role };

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
