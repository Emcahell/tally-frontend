import { Link } from 'react-router-dom';
import { Bell } from 'phosphor-react';
import { Avatar } from '../../ui/Avatar';
import { IconButton } from '../../ui/IconButton';
import { useAuth } from '../../../hooks/useAuth';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-bg-deep/80 backdrop-blur-xl px-5 pt-10 pb-4 flex items-center justify-between max-w-lg mx-auto">
      <Link to="/perfil" className="flex items-center gap-3">
        <Avatar
          src={user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
          alt={user?.name || 'Usuario'}
          showStatus
        />
        <div>
          <p className="text-xs text-text-muted font-medium">Bienvenido,</p>
          <h1 className="text-sm font-semibold text-text-primary tracking-wide">
            {user?.name || 'Usuario'}
          </h1>
        </div>
      </Link>

      <IconButton aria-label="Notificaciones" badge>
        <Bell size={20} weight="bold" />
      </IconButton>
    </header>
  );
}
