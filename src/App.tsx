import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { TermsAndConditionsPage } from './pages/terms/TermsAndConditionsPage';
import { WelcomePage } from './pages/welcome/WelcomePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { PersonalDataPage } from './pages/profile/PersonalDataPage';
import { InformationPage } from './pages/profile/InformationPage';
import { SecurityPage } from './pages/profile/SecurityPage';
import { CardsPage } from './pages/cards/CardsPage';
import { SendMoneyPage } from './pages/transfer/SendMoneyPage';
import { BottomNav } from './components/shared/layout/BottomNav';
import {
  ProtectedRoute,
  PublicOnlyRoute,
  RootRedirect,
} from './routes/ProtectedRoute';

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
      {/* Public routes (redirect to /inicio if session is active) */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
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
        path="/perfil/datos-personales"
        element={
          <ProtectedRoute>
            <PersonalDataPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil/seguridad"
        element={
          <ProtectedRoute>
            <SecurityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil/informacion"
        element={
          <ProtectedRoute>
            <InformationPage />
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
      <Route
        path="/enviar"
        element={
          <ProtectedRoute>
            <SendMoneyPage />
          </ProtectedRoute>
        }
      />

      {/* Redirects: root and unknown paths follow session state */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;
