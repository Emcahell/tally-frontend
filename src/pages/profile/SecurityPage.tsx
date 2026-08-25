import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaretLeft, Eye, EyeSlash, CheckCircle } from "phosphor-react";
import { GlassCard } from "../../components/ui/GlassCard";
import { changePassword } from "../../services/auth.service";

export function SecurityPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (currentPassword === newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setSaving(true);

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cambiar contraseña",
      );
    } finally {
      setSaving(false);
    }
  }

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
            <CaretLeft size={20} weight="bold" />
          </button>
          <h1 className="text-base font-bold text-text-primary">Seguridad</h1>
        </header>

        <main className="px-5 mt-12 space-y-6">
          {/* Success message */}
          {success && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-success/10 border border-success/20">
              <CheckCircle
                size={20}
                weight="fill"
                className="text-success shrink-0"
              />
              <span className="text-sm font-medium text-success">
                Contraseña actualizada correctamente
              </span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm font-medium">
              {error}
            </div>
          )}

          {/* Password form */}
          <GlassCard className="p-5">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
              Cambiar contraseña
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current password */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                    className="w-full h-11 px-4 pr-11 rounded-xl bg-bg-deep border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    aria-label={
                      showCurrent ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showCurrent ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingresa la nueva contraseña"
                    className="w-full h-11 px-4 pr-11 rounded-xl bg-bg-deep border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    aria-label={
                      showNew ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showNew ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma la nueva contraseña"
                    className="w-full h-11 px-4 pr-11 rounded-xl bg-bg-deep border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                    aria-label={
                      showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showConfirm ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full h-12 rounded-xl bg-primary text-bg-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary-accent active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-bg-deep/30 border-t-bg-deep rounded-full animate-spin" />
                ) : (
                  "Guardar contraseña"
                )}
              </button>
            </form>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
