import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Envelope, Lock, Eye, EyeSlash } from "phosphor-react";
import { AuthLayout } from "../../components/shared/layout/AuthLayout";
import { GlassCard } from "../../components/ui/GlassCard";
import { login } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../../components/shared/Logo";

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.token);
      setUser(response.user);
      navigate("/inicio", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      {/* Logo / Brand */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mx-auto mb-4">
          <Logo />
          <h1 className="text-3xl font-extrabold text-primary ml-2">Tally</h1>
        </div>
        <h2 className="text-xl font-semibold text-text-primary tracking-tight">
          Tu dinero <span className="text-primary">Tally</span> como es
        </h2>
        <p className="text-sm text-text-muted mt-1">
          Inicia sesión para acceder a tu cuenta
        </p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-text-secondary mb-1.5"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Envelope
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-text-secondary mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full h-12 pl-11 pr-11 rounded-xl bg-bg-surface border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-bg-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-accent active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin" />
            ) : (
              <>Iniciar Sesión</>
            )}
          </button>
        </form>

        {/* Register link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            <Link
              to="/register"
              className="text-primary font-semibold hover:text-primary-accent transition-colors"
            >
              Quiero crearme una cuenta en Tally
            </Link>
          </p>
        </div>
      </GlassCard>
    </AuthLayout>
  );
}
