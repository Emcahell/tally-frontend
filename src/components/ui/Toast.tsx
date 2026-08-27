import { useEffect, useState } from "react";
import { Info } from "phosphor-react";

interface ToastProps {
  message: string;
  duration?: number;
  onDismiss: () => void;
}

export function Toast({ message, duration = 3000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Start exit
    const exitTimer = setTimeout(() => setVisible(false), duration);
    // Remove from DOM
    const dismissTimer = setTimeout(onDismiss, duration + 400);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [duration, onDismiss]);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[calc(100%-2rem)] px-4 py-3 rounded-xl bg-bg-surface border border-border shadow-xl flex items-center gap-3 transition-all duration-300 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full"
      }`}
    >
      <div className="w-8 h-8 rounded-lg bg-accent-cyan/15 flex items-center justify-center flex-shrink-0">
        <Info size={18} weight="fill" className="text-accent-cyan" />
      </div>
      <p className="text-sm text-text-primary font-medium">{message}</p>
    </div>
  );
}
