import { createContext } from 'react';

export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  role: Role;
  systemName?: string;
}

export interface AuthContextType {
  currentUser: User;
  toggleRole: () => void;
  setRole: (role: Role) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
