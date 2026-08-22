import {
  House,
  ArrowUpRight,
  DownloadSimple,
  CreditCard,
} from "phosphor-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: House, label: "Inicio", active: true },
  { icon: ArrowUpRight, label: "Enviar" },
  { icon: DownloadSimple, label: "Depositar" },
  { icon: CreditCard, label: "Tarjetas" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface/90 backdrop-blur-xl border-t border-border overflow-hidden">
      <div className="flex items-center justify-around px-2 py-2 w-screen ">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <button
              key={item.label}
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
            </button>
          );
        })}
      </div>
    </nav>
  );
}
