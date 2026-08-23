import { Link, useLocation } from "react-router-dom";
import {
  SquaresFour,
  ArrowUpRight,
  DownloadSimple,
  CreditCard,
} from "phosphor-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { icon: SquaresFour, label: "Inicio", to: "/inicio" },
  { icon: ArrowUpRight, label: "Enviar", to: "/enviar" },
  { icon: DownloadSimple, label: "Depositar", to: "/depositar" },
  { icon: CreditCard, label: "Tarjetas", to: "/tarjetas" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface/90 backdrop-blur-xl border-t border-border overflow-hidden">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

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
  );
}
