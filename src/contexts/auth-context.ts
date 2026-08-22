import { createContext } from 'react';
import type { User } from '../types/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
