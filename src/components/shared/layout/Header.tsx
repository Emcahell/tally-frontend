import { Link } from 'react-router-dom';
import { Bell } from 'phosphor-react';
import { IconButton } from '../../ui/IconButton';
import { Skeleton } from '../../ui/Skeleton';
import { useAuth } from '../../../hooks/useAuth';

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

      <IconButton aria-label="Notificaciones" badge>
        <Bell size={20} weight="bold" />
      </IconButton>
    </header>
  );
}
