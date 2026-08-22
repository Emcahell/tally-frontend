import { useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Question,
  SignOut,
  CaretRight,
  CheckCircle,
  ArrowLeft,
} from 'phosphor-react';
import { Avatar } from '../../components/ui/Avatar';
import { GlassCard } from '../../components/ui/GlassCard';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  color?: string;
  onClick?: () => void;
}

export function ProfilePage() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  }

  const menuItems: MenuItem[] = [
    { icon: User, label: 'Datos Personales' },
    { icon: ShieldCheck, label: 'Seguridad & Biometría' },
    { icon: Question, label: 'Soporte 24/7' },
    { icon: SignOut, label: 'Cerrar Sesión', color: 'text-error', onClick: handleLogout },
  ];

  return (
    <div className="min-h-dvh relative">
      {/* Glow backgrounds */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-bg-deep/80 backdrop-blur-xl px-5 pt-10 pb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft size={20} weight="bold" />
          </button>
          <h1 className="text-base font-bold text-text-primary">Mi Perfil</h1>
        </header>

        <main className="px-5 space-y-6">
          {/* Profile Card */}
          <GlassCard className="overflow-hidden">
            {/* Gradient Header */}
            <div className="h-24 bg-gradient-to-br from-primary/30 via-accent-violet/20 to-accent-cyan/10 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6 -mt-12 relative z-10 flex flex-col items-center text-center">
              <Avatar
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                alt="Alex Turner"
                size="lg"
                showStatus
              />
              <h2 className="text-lg font-bold text-text-primary mt-3">
                Alex Turner
              </h2>
              <p className="text-sm text-text-muted mt-0.5">
                alex.turner@tallybank.com
              </p>

              {/* KYC Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
                <CheckCircle size={14} weight="fill" className="text-success" />
                <span className="text-xs font-semibold text-success">
                  Cuenta Verificada (KYC)
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Menu Items */}
          <GlassCard className="divide-y divide-border overflow-hidden">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isLogout = item.onClick !== undefined;

              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${
                    isLogout
                      ? 'hover:bg-error/5'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon
                    size={20}
                    weight="regular"
                    className={item.color || 'text-text-secondary'}
                  />
                  <span
                    className={`flex-1 text-sm font-medium ${
                      item.color || 'text-text-primary'
                    }`}
                  >
                    {item.label}
                  </span>
                  {!isLogout && (
                    <CaretRight size={16} weight="fill" className="text-text-muted" />
                  )}
                </button>
              );
            })}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
