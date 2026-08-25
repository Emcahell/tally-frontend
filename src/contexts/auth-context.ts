import { createContext } from 'react';
import type { User, Account, ProfileData } from '../types/auth';

export interface AuthContextType {
  user: User | null;
  account: Account | null;
  profile: ProfileData | null;
  loading: boolean;
  isRefreshing: boolean;
  setUser: (user: User | null) => void;
  setAccount: (account: Account | null) => void;
  setProfile: (profile: ProfileData | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
