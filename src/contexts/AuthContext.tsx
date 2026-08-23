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

      // Fire both requests in parallel, but handle each independently
      // so state updates as soon as each one resolves.
      const mePromise = getMe();
      const accPromise = getAccount();

      mePromise
        .then(me => { if (!cancelled) setUser(me); })
        .catch(() => {
          localStorage.removeItem('token');
          if (!cancelled) setUser(null);
        });

      accPromise
        .then(acc => { if (!cancelled) setAccount(acc); })
        .catch(() => { if (!cancelled) setAccount(null); });

      await Promise.allSettled([mePromise, accPromise]);

      if (!cancelled) setLoading(false);
    }

    fetchUser();

    return () => { cancelled = true; };
  }, []);

  return (
    <AuthContext.Provider value={{ user, account, loading, setUser, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
