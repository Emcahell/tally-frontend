import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import type { User, Account, ProfileData } from '../types/auth';
import { getMe, getProfile } from '../services/auth.service';
import { getAccount } from '../services/account.service';

const CACHE_USER_KEY = 'cache_user';
const CACHE_ACCOUNT_KEY = 'cache_account';
const CACHE_PROFILE_KEY = 'cache_profile';

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
  localStorage.removeItem(CACHE_PROFILE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadCache<User>(CACHE_USER_KEY));
  const [account, setAccount] = useState<Account | null>(() => loadCache<Account>(CACHE_ACCOUNT_KEY));
  const [profile, setProfile] = useState<ProfileData | null>(() => loadCache<ProfileData>(CACHE_PROFILE_KEY));
  const profileRef = useRef(profile);
  profileRef.current = profile;
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

      // Fire all requests in parallel, but handle each independently
      const mePromise = getMe();
      const accPromise = getAccount();
      const profilePromise = getProfile();

      mePromise
        .then(me => {
          if (!cancelled) {
            setUser(me);
            saveCache(CACHE_USER_KEY, me);
          }
        })
        .catch((err) => {
          // Only clear session on 401 (token expired/invalid).
          const isAuth = err instanceof Error && err.message === 'Sesión expirada';
          if (isAuth) {
            clearCache();
            if (!cancelled) setUser(null);
          }
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

      profilePromise
        .then(prof => {
          if (!cancelled) {
            // Merge with existing profile to preserve photo/updates from PersonalDataPage
            const prev = profileRef.current;
            const merged = { ...prev, ...prof };
            // If the fetch result has no photo but prev did, keep the prev photo
            if (prev?.photo && !prof.photo) {
              merged.photo = prev.photo;
            }
            setProfile(merged);
            saveCache(CACHE_PROFILE_KEY, merged);
          }
        })
        .catch(() => {
          // Keep cached profile visible
        });

      await Promise.allSettled([mePromise, accPromise, profilePromise]);

      if (!cancelled) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }

    fetchUser();

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, account, profile, loading, isRefreshing, setUser, setAccount, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
