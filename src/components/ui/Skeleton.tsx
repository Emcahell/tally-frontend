interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gradient-to-r from-border/60 via-border/30 to-border/60 ${className}`}
    />
  );
}
