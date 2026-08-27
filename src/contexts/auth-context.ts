import { createContext } from 'react';
import type { User, Account, ProfileData } from '../types/auth';

export interface AuthContextType {
  user: User | null;
  account: Account | null;
  profile: ProfileData | null;
  unreadCount: number;
  loading: boolean;
  isRefreshing: boolean;
  /** true mientras se obtiene la cuenta del backend (login, registro o refresh) */
  accountLoading: boolean;
  setUser: (user: User | null) => void;
  setAccount: (account: Account | null) => void;
  setProfile: (profile: ProfileData | null) => void;
  setUnreadCount: (count: number) => void;
  /** Obtiene la cuenta del backend, la guarda en contexto y caché.
   *  `retries` reintenta con espera ante fallos (ej. cuenta recién creada). */
  refreshAccount: (retries?: number) => Promise<Account | null>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
