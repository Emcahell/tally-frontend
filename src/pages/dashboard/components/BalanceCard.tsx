import { useState } from 'react';
import { ArrowClockwise, Eye, EyeSlash, ShareNetwork } from 'phosphor-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import type { ReactNode } from 'react';

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface/60 border border-border text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all text-xs font-medium"
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

export function BalanceCard() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const accountNumber = '1234567890123456';
  const balance = 24850.40;

  return (
    <GlassCard glow className="p-6">
      {/* Top Row: Label + Action Buttons */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          Balance Total
        </span>
        <div className="flex items-center gap-1.5">
          <ActionButton
            icon={<ArrowClockwise size={14} weight="bold" />}
            label="Refrescar"
            onClick={() => {}}
          />
          <ActionButton
            icon={balanceVisible
              ? <EyeSlash size={14} weight="bold" />
              : <Eye size={14} weight="bold" />
            }
            label={balanceVisible ? 'Ocultar' : 'Mostrar'}
            onClick={() => setBalanceVisible(!balanceVisible)}
          />
          <ActionButton
            icon={<ShareNetwork size={14} weight="bold" />}
            label="Compartir"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Balance Amount */}
      <div className="flex items-baseline gap-2 mb-2">
        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
          {balanceVisible
            ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            : '••••••'}
        </h2>
        <span className="text-sm text-text-muted font-medium">USD</span>
      </div>

      {/* Account Number */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-text-secondary font-mono tracking-wider">
          {maskAccountNumber(accountNumber)}
        </span>
      </div>
    </GlassCard>
  );
}
