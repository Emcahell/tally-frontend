import { Link } from 'react-router-dom';
import { Bell } from 'phosphor-react';
import { IconButton } from '../../ui/IconButton';
import { Skeleton } from '../../ui/Skeleton';
import { useAuth } from '../../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { getUnreadNotifications } from '../../../services/notification.service';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Header() {
  const { user, profile, loading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchUnread = async () => {
      try {
        const res = await getUnreadNotifications();
        if (!cancelled) setUnreadCount(res.unread_count);
      } catch {
        // ignore
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-deep/80 backdrop-blur-xl px-5 pt-10 pb-4 flex items-center justify-between max-w-lg mx-auto">
      <Link to="/perfil" className="flex items-center gap-3">
        {profile?.photo ? (
          <img
            src={profile.photo}
            alt={profile.name || user?.name || 'Usuario'}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/50"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {loading ? '' : getInitials(user?.name || 'U')}
            </span>
          </div>
        )}
        <div>
          <p className="text-xs text-text-muted font-medium">Bienvenido,</p>
          {loading && !user ? (
            <Skeleton className="h-4 w-28 mt-0.5" />
          ) : (
            <h1 className="text-sm font-semibold text-text-primary tracking-wide">
              {user?.name || 'Usuario'}
            </h1>
          )}
        </div>
      </Link>

      <Link to="/notificaciones" className="relative">
        <IconButton aria-label="Notificaciones">
          <Bell size={20} weight="bold" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-bg-deep animate-pulse" />
          )}
        </IconButton>
      </Link>
    </header>
  );
}
