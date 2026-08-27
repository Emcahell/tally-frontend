import { X, Shield, Lightning, DeviceMobileCamera } from "phosphor-react";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import { Isotipo } from "../../components/shared/Isotipo";

/**
 * Modal superior que invita al usuario a instalar la app como PWA.
 * - Solo se muestra si la app es instalable (beforeinstallprompt disponible)
 * - No se muestra si ya está instalada o si el usuario la descartó
 */
export function InstallPwaModal() {
  const { isInstallable, install, dismiss } = usePwaInstall();

  if (!isInstallable) return null;

  return (
    <div className="fixed inset-0 z-[100] p-4 pointer-events-auto animate-slide-down">
      {/* Full-screen card with corner margins */}
      <div className="relative w-full h-full rounded-3xl bg-bg-card border border-border backdrop-blur-xl p-5 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-accent-cyan/8 rounded-full blur-[80px] pointer-events-none" />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors z-20"
          aria-label="Cerrar"
        >
          <X size={16} weight="bold" />
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-2">
          {/* Icon */}
          <div className="w-20 h-20 flex items-center justify-center mb-2 mt-16">
            <DeviceMobileCamera
              size={40}
              weight="bold"
              className="text-primary"
            />
          </div>

          <h2 className="text-xl font-extrabold text-text-primary tracking-tight">
            Instalar Tally
          </h2>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed max-w-xs">
            Accede más rápido desde tu pantalla de inicio. ¡Es gratis!
          </p>

          {/* Benefits */}
          <div className="flex gap-6 mt-6">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center">
                <Lightning
                  size={18}
                  weight="fill"
                  className="text-accent-amber"
                />
              </div>
              <span className="text-[11px] text-text-muted font-medium">
                Rápido
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <Shield size={18} weight="fill" className="text-accent-cyan" />
              </div>
              <span className="text-[11px] text-text-muted font-medium">
                Seguro
              </span>
            </div>
          </div>

          <div className="mt-auto scale-150">
            <Isotipo />
          </div>

          {/* Actions */}
          <div className="w-full max-w-xs mt-auto pt-8 pb-2">
            <button
              onClick={install}
              className="w-full h-12 rounded-xl bg-primary text-bg-deep font-semibold text-sm hover:bg-primary-accent active:scale-[0.98] transition-all"
            >
              Instalar app
            </button>
            <button
              onClick={dismiss}
              className="w-full h-10 mt-2 rounded-xl text-text-muted text-xs font-medium hover:text-text-secondary transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
