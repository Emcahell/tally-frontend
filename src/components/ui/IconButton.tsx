import type { ReactNode } from 'react';

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  badge?: boolean;
  className?: string;
  'aria-label': string;
}

export function IconButton({ children, onClick, badge = false, className = '', ...props }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors ${className}`}
      {...props}
    >
      {children}
      {badge && (
        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
      )}
    </button>
  );
}
