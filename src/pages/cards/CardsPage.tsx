import { useState } from "react";
import { Snowflake, Globe, Eye, EyeSlash, Warning } from "phosphor-react";
import { Header } from "../../components/shared/layout/Header";
import { BottomNav } from "../../components/shared/layout/BottomNav";
import { BankCard } from "./components/BankCard";
import { Skeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../hooks/useAuth";

interface SettingCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  danger?: boolean;
  onClick: () => void;
}

function SettingCard({
  icon,
  label,
  description,
  active,
  danger,
  onClick,
}: SettingCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
        danger
          ? active
            ? "bg-error/10 border-error/30"
            : "bg-bg-card border-border hover:border-error/20"
          : active
            ? "bg-primary/10 border-primary/30"
            : "bg-bg-card border-border hover:border-primary/20"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          danger
            ? "bg-error/15 text-error"
            : active
              ? "bg-primary/15 text-primary"
              : "bg-bg-surface text-text-secondary"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold ${danger && active ? "text-error" : "text-text-primary"}`}
        >
          {label}
        </p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
      {/* Toggle */}
      <div
        className={`w-11 h-6 rounded-full flex items-center transition-colors ${
          danger
            ? active
              ? "bg-error"
              : "bg-bg-surface"
            : active
              ? "bg-primary"
              : "bg-primary/12"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
            danger
              ? active
                ? "translate-x-[22px]"
                : "translate-x-[2px]"
              : active
                ? "translate-x-[22px]"
                : "translate-x-[2px]"
          }`}
        />
      </div>
    </button>
  );
}

function readBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? v === 'true' : fallback;
  } catch {
    return fallback;
  }
}

export function CardsPage() {
  const { user, account, loading } = useAuth();
  const [cardVisible, setCardVisible] = useState(false);
  const [frozen, setFrozen] = useState(() => readBool('card_frozen', false));
  const [international, setInternational] = useState(() => readBool('card_international', false));

  function toggleFrozen() {
    const next = !frozen;
    setFrozen(next);
    localStorage.setItem('card_frozen', String(next));
  }

  function toggleInternational() {
    const next = !international;
    setInternational(next);
    localStorage.setItem('card_international', String(next));
  }

  const card = account?.cards?.[0];
  const holderName = (card?.card_holder ?? user?.name ?? 'TALLY USER').toUpperCase();
  const showCardSkeleton = loading && !card;

  return (
    <div className="min-h-dvh relative">
      {/* Glow backgrounds */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <div className="relative z-10 max-w-lg mx-auto pb-24">
        <div className="h-28" />

        <main className="px-5 space-y-6">
          {/* Bank Card */}
          <div className="flex justify-center -mx-5 px-5 overflow-x-auto scrollbar-hide">
            {showCardSkeleton ? (
              <div className="min-w-[280px] sm:min-w-[320px] h-[180px] rounded-2xl p-5 flex flex-col justify-between border border-white/20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-900">
                <div className="flex justify-between items-start z-10">
                  <Skeleton className="h-5 w-24 bg-white/20" />
                  <Skeleton className="h-5 w-5 rounded-full bg-white/20" />
                </div>
                <div className="z-10 space-y-3">
                  <Skeleton className="h-3 w-48 bg-white/20" />
                  <div className="flex gap-6">
                    <div className="space-y-1">
                      <Skeleton className="h-2 w-12 bg-white/20" />
                      <Skeleton className="h-3 w-20 bg-white/20" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-2 w-8 bg-white/20" />
                      <Skeleton className="h-3 w-10 bg-white/20" />
                    </div>
                    <div className="space-y-1">
                      <Skeleton className="h-2 w-8 bg-white/20" />
                      <Skeleton className="h-3 w-8 bg-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <BankCard
                cardNumber={card?.card_number ?? ''}
                holderName={holderName}
                expiration={card?.expiry_date ?? ''}
                cvv={card?.cvv ?? ''}
                visible={cardVisible}
              />
            )}
          </div>

          {/* Frozen warning */}
          {frozen && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-info/10 border border-info/20">
              <Warning size={18} className="text-info shrink-0" weight="fill" />
              <p className="text-xs text-info font-medium">
                Tu tarjeta está congelada. No se procesarán transacciones.
              </p>
            </div>
          )}

          {/* Security Settings */}
          <div>
            <h3 className="text-sm font-bold text-text-primary mb-3">
              Seguridad
            </h3>
            <div className="space-y-3">
              <SettingCard
                icon={<Snowflake size={20} weight="bold" />}
                label="Congelar tarjeta"
                description={
                  frozen
                    ? "Tarjeta desactivada temporalmente"
                    : "Bloquea transacciones temporalmente"
                }
                active={frozen}
                danger={frozen}
                onClick={toggleFrozen}
              />
              <SettingCard
                icon={<Globe size={20} weight="bold" />}
                label="Pagos internacionales"
                description={
                  international
                    ? "Compras en el exterior activadas"
                    : "Compras fuera del país desactivadas"
                }
                active={international}
                onClick={toggleInternational}
              />
              <SettingCard
                icon={
                  cardVisible ? (
                    <EyeSlash size={20} weight="bold" />
                  ) : (
                    <Eye size={20} weight="bold" />
                  )
                }
                label={cardVisible ? "Ocultar datos" : "Mostrar datos"}
                description={
                  cardVisible
                    ? "Datos visibles en pantalla"
                    : "Datos ocultos por seguridad"
                }
                active={cardVisible}
                onClick={() => setCardVisible(!cardVisible)}
              />
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
