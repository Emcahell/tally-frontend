import { useNavigate } from "react-router-dom";
import { CaretLeft } from "phosphor-react";

interface PageHeaderProps {
  /** Título que se muestra junto al botón de volver */
  title: string;
  /** Ruta destino al pulsar volver. Si se omite navega hacia atrás. */
  backTo?: string;
}

export function PageHeader({ title, backTo }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 px-5 pt-6 pb-4 flex items-center gap-3">
      <button
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        className="w-10 h-10 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        aria-label="Volver"
      >
        <CaretLeft size={20} weight="bold" />
      </button>
      <h1 className="text-base font-bold text-text-primary">{title}</h1>
    </header>
  );
}
