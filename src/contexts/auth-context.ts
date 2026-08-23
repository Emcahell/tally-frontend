import { createContext } from 'react';
import type { User, Account } from '../types/auth';

export interface AuthContextType {
  user: User | null;
  account: Account | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setAccount: (account: Account | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
