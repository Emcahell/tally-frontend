import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className = '', glow = false }: GlassCardProps) {
  return (
    <div className="relative rounded-3xl bg-bg-card border border-border backdrop-blur-xl">
      {glow && (
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/15 rounded-full blur-2xl pointer-events-none" />
      )}
      {/* Las clases del consumidor van en el wrapper del contenido para que
          utilidades como flex, space-y o divide-y apliquen a los hijos */}
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  );
}
