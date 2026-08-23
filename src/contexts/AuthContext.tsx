import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import type { User, Account } from '../types/auth';
import { getMe } from '../services/auth.service';
import { getAccount } from '../services/account.service';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const [me, acc] = await Promise.all([getMe(), getAccount()]);
        if (!cancelled) {
          setUser(me);
          setAccount(acc);
        }
      } catch {
        localStorage.removeItem('token');
        if (!cancelled) {
          setUser(null);
          setAccount(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUser();

    return () => { cancelled = true; };
  }, []);

  return (
    <AuthContext.Provider value={{ user, account, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
