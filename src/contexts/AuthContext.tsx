import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import type { User } from '../types/auth';
import { getMe } from '../services/auth.service';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
        const me = await getMe();
        if (!cancelled) setUser(me);
      } catch {
        localStorage.removeItem('token');
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUser();

    return () => { cancelled = true; };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
