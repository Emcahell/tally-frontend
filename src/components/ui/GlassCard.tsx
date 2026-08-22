import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className = '', glow = false }: GlassCardProps) {
  return (
    <div
      className={`relative rounded-3xl bg-bg-card border border-border backdrop-blur-xl ${className}`}
    >
      {glow && (
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/15 rounded-full blur-2xl pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
