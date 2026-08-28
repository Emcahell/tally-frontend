import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import type { User, Account, ProfileData } from '../types/auth';
import { getMe, getProfile } from '../services/auth.service';
import { getAccount } from '../services/account.service';
import { getUnreadNotifications } from '../services/notification.service';

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

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);

  // After login, user is set but profile/account may not be yet.
  // This effect fetches them when user becomes available for the first time
  // (i.e., after LoginPage calls setUser without the main effect re-running).
  // After login, user is set but profile/account may not be yet.
  // This effect fetches them when user becomes available after a fresh login.
  const didFetchProfileRef = useRef(false);
  useEffect(() => {
    // Reset when user logs out so next login triggers a fresh fetch
    if (!user) {
      didFetchProfileRef.current = false;
      return;
    }
    if (profile || didFetchProfileRef.current) return;
    didFetchProfileRef.current = true;

    let cancelled = false;

    getProfile()
      .then((prof) => {
        if (!cancelled) {
          setProfile(prof);
          saveCache(CACHE_PROFILE_KEY, prof);
        }
      })
      .catch(() => {});

    getAccount()
      .then((acc) => {
        if (!cancelled) {
          setAccount(acc);
          saveCache(CACHE_ACCOUNT_KEY, acc);
        }
      })
      .catch(() => {});

    getUnreadNotifications()
      .then((res) => {
        if (!cancelled) setUnreadCount(res.unread_count);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [user, profile]);

  /** Obtiene la cuenta del backend y la sincroniza con contexto + caché.
   *  Centraliza el fetch para que login, registro y refresh compartan estado. */
  async function refreshAccount(retries = 0): Promise<Account | null> {
    setAccountLoading(true);
    try {
      const acc = await getAccount();
      setAccount(acc);
      saveCache(CACHE_ACCOUNT_KEY, acc);
      return acc;
    } catch {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return refreshAccount(retries - 1);
      }
      return null;
    } finally {
      setAccountLoading(false);
    }
  }

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
      const notifPromise = getUnreadNotifications();

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

      notifPromise
        .then((res) => {
          if (!cancelled) setUnreadCount(res.unread_count);
        })
        .catch(() => {});

      await Promise.allSettled([mePromise, accPromise, profilePromise, notifPromise]);

      if (!cancelled) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }

    fetchUser();

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, account, profile, unreadCount, loading, isRefreshing, accountLoading, setUser, setAccount, setProfile, setUnreadCount, refreshAccount }}>
      {children}
    </AuthContext.Provider>
  );
}
