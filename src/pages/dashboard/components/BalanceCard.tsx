import { useState } from 'react';
import { ArrowClockwise, Eye, EyeSlash, ShareNetwork, X } from 'phosphor-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Skeleton } from '../../../components/ui/Skeleton';
import type { ReactNode } from 'react';

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function ActionButton({ icon, label, onClick, disabled }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-medium ${
        disabled
          ? 'bg-bg-surface/30 border-border/50 text-text-muted cursor-not-allowed'
          : 'bg-bg-surface/60 border-border text-text-secondary hover:text-text-primary hover:border-primary/30'
      }`}
      aria-label={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function maskAccountNumber(number: string): string {
  if (number.length <= 4) return number;
  const visible = number.slice(-4);
  const masked = number.slice(0, -4).replace(/\d/g, '*');
  return `${masked}${visible}`;
}

interface BalanceCardProps {
  balance: string;
  accountNumber: string;
  onRefresh?: () => void;
  balanceLoading?: boolean;
}

export function BalanceCard({ balance, accountNumber, onRefresh, balanceLoading = false }: BalanceCardProps) {
  const parsedBalance = parseFloat(balance) || 0;
  const [balanceVisible, setBalanceVisible] = useState(() => {
    try {
      const v = localStorage.getItem('balance_visible');
      return v !== null ? v === 'true' : true;
    } catch {
      return true;
    }
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [spinning, setSpinning] = useState(false);

  function handleRefresh() {
    if (cooldown) return;
    setCooldown(true);
    setSpinning(true);
    onRefresh?.();
    setTimeout(() => setSpinning(false), 800);
    setTimeout(() => setCooldown(false), 20000);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Mi número de cuenta Tally',
        text: `Mi número de cuenta es: ${accountNumber}`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(accountNumber).catch(() => {});
    }
    setShowShareModal(false);
  }

  return (
    <>
      <GlassCard glow className="p-6">
        {/* Top Row: Label + Action Buttons */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
            Balance Total
          </span>
          <div className="flex items-center gap-1.5">
            <ActionButton
              icon={<ArrowClockwise size={14} weight="bold" className={spinning ? 'animate-spin' : ''} />}
              label="Refrescar"
              onClick={handleRefresh}
              disabled={cooldown}
            />
            <ActionButton
              icon={balanceVisible
                ? <EyeSlash size={14} weight="bold" />
                : <Eye size={14} weight="bold" />
              }
              label={balanceVisible ? 'Ocultar' : 'Mostrar'}
              onClick={() => {
                const next = !balanceVisible;
                setBalanceVisible(next);
                localStorage.setItem('balance_visible', String(next));
              }}
            />
            <ActionButton
              icon={<ShareNetwork size={14} weight="bold" />}
              label="Compartir"
              onClick={() => setShowShareModal(true)}
            />
          </div>
        </div>

        {/* Balance Amount */}
        <div className="flex items-baseline gap-2 mb-2">
          {balanceLoading ? (
            <Skeleton className="h-9 w-44" />
          ) : (
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
              {balanceVisible
                ? `$${parsedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : '••••••'}
            </h2>
          )}
          <span className="text-sm text-text-muted font-medium">USD</span>
        </div>

        {/* Account Number */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary font-mono tracking-wider">
            {maskAccountNumber(accountNumber)}
          </span>
        </div>
      </GlassCard>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setShowShareModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-sm bg-bg-surface border border-border rounded-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} weight="bold" />
            </button>

            {/* Title */}
            <h3 className="text-base font-bold text-text-primary pr-8">
              Compartir número de cuenta
            </h3>

            {/* Message */}
            <p className="text-sm text-text-secondary">
              ¿Deseas compartir tu número de cuenta?
            </p>

            {/* Account number */}
            <div className="px-4 py-3 rounded-xl bg-bg-deep border border-border text-center">
              <p className="text-lg font-mono font-bold text-text-primary tracking-wider">
                {accountNumber}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 h-11 rounded-xl bg-bg-card border border-border text-text-secondary font-semibold text-sm hover:text-text-primary hover:border-primary/30 transition-all"
              >
                No
              </button>
              <button
                onClick={handleShare}
                className="flex-1 h-11 rounded-xl bg-primary text-bg-deep font-semibold text-sm hover:bg-primary-accent active:scale-[0.98] transition-all"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
