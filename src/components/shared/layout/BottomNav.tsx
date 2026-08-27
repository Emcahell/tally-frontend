import { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  House,
  ArrowUpRight,
  DownloadSimple,
  CreditCard,
} from "phosphor-react";
import { Toast } from "../../ui/Toast";

interface NavItem {
  icon: React.ElementType;
  label: string;
  to: string;
  unavailable?: boolean;
}

const navItems: NavItem[] = [
  { icon: House, label: "Inicio", to: "/inicio" },
  { icon: ArrowUpRight, label: "Enviar", to: "/enviar" },
  { icon: DownloadSimple, label: "Depositar", to: "/depositar", unavailable: true },
  { icon: CreditCard, label: "Tarjetas", to: "/tarjetas" },
];

export function BottomNav() {
  const location = useLocation();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback(() => {
    setToastMsg("Esta función aún no está disponible. ¡Próximamente!");
  }, []);

  const dismissToast = useCallback(() => setToastMsg(null), []);

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onDismiss={dismissToast} />}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface/90 backdrop-blur-xl border-t border-border overflow-hidden">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            if (item.unavailable) {
              return (
                <button
                  key={item.label}
                  onClick={showToast}
                  className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors text-text-muted hover:text-text-secondary"
                  aria-label={item.label}
                >
                  <Icon size={22} weight="regular" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={22} weight={isActive ? "fill" : "regular"} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
