import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import type { User, Account } from '../types/auth';
import { getMe } from '../services/auth.service';
import { getAccount } from '../services/account.service';

const CACHE_USER_KEY = 'cache_user';
const CACHE_ACCOUNT_KEY = 'cache_account';

function loadCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveCache(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage full or unavailable – ignore
  }
}

function clearCache() {
  localStorage.removeItem(CACHE_USER_KEY);
  localStorage.removeItem(CACHE_ACCOUNT_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadCache<User>(CACHE_USER_KEY));
  const [account, setAccount] = useState<Account | null>(() => loadCache<Account>(CACHE_ACCOUNT_KEY));
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        clearCache();
        if (!cancelled) {
          setUser(null);
          setAccount(null);
          setLoading(false);
        }
        return;
      }

      // If we already have cached data, this is a background refresh
      const hasCache = user !== null || account !== null;
      if (hasCache && !cancelled) {
        setIsRefreshing(true);
      }

      // Fire both requests in parallel, but handle each independently
      const mePromise = getMe();
      const accPromise = getAccount();

      mePromise
        .then(me => {
          if (!cancelled) {
            setUser(me);
            saveCache(CACHE_USER_KEY, me);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          clearCache();
          if (!cancelled) setUser(null);
        });

      accPromise
        .then(acc => {
          if (!cancelled) {
            setAccount(acc);
            saveCache(CACHE_ACCOUNT_KEY, acc);
          }
        })
        .catch(() => {
          if (!cancelled) setAccount(null);
        });

      await Promise.allSettled([mePromise, accPromise]);

      if (!cancelled) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }

    fetchUser();

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, account, loading, isRefreshing, setUser, setAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
