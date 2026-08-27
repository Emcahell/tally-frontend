import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RouteGuardProps {
  children: React.ReactNode;
}

function FullScreenLoader() {
  return (
    <div className="min-h-dvh bg-bg-deep flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

/** Permite el acceso solo con sesión activa.
 *  Muestra un loader mientras se valida la sesión en frío (sin caché). */
export function ProtectedRoute({ children }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!user) {
    if (loading) {
      return <FullScreenLoader />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

/** Rutas públicas (login/register): si ya hay sesión activa redirige a inicio. */
export function PublicOnlyRoute({ children }: RouteGuardProps) {
  const { user } = useAuth();

  // Si el usuario acaba de registrarse, no redirigir a /inicio.
  // El flag se limpia en WelcomePage.
  if (user && !localStorage.getItem('justRegistered')) {
    return <Navigate to="/inicio" replace />;
  }

  return <>{children}</>;
}

/** Redirige la raíz según el estado de la sesión:
 *  con sesión abierta a /inicio, sin sesión a /login. */
export function RootRedirect() {
  const { user } = useAuth();

  return <Navigate to={user ? '/inicio' : '/login'} replace />;
}
