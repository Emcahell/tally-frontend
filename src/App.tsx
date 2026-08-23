import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { TermsAndConditionsPage } from './pages/terms/TermsAndConditionsPage';
import { WelcomePage } from './pages/welcome/WelcomePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { CardsPage } from './pages/cards/CardsPage';
import { BottomNav } from './components/shared/layout/BottomNav';
import { ProtectedRoute } from './routes/ProtectedRoute';

function DashboardLayout() {
  return (
    <>
      <DashboardPage />
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/terminos" element={<TermsAndConditionsPage />} />

      {/* Protected routes */}
      <Route
        path="/bienvenida"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inicio"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tarjetas"
        element={
          <ProtectedRoute>
            <CardsPage />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
