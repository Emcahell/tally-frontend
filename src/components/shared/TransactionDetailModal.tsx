import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  X,
} from "phosphor-react";
import { Skeleton } from "../ui/Skeleton";
import { getTransfer } from "../../services/transfer.service";
import type { Transfer } from "../../types/transfer";
import {
  formatTransferMoney,
  getTransferDirection,
} from "../../utils/transfer-format";

interface TransactionDetailModalProps {
  /** Id de la transferencia a mostrar */
  transferId: number;
  userId?: number;
  onClose: () => void;
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  completed: { label: "Completada", cls: "bg-success/15 text-success" },
  pending: { label: "Pendiente", cls: "bg-accent-amber/15 text-accent-amber" },
  failed: { label: "Fallida", cls: "bg-error/15 text-error" },
  rejected: { label: "Rechazada", cls: "bg-error/15 text-error" },
};

function StatusPill({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status] ?? { label: status, cls: "bg-bg-surface text-text-secondary" };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border border-border text-xs font-semibold ${style.cls}`}
    >
      {style.label}
    </span>
  );
}

/** Se monta únicamente cuando hay una transferencia seleccionada,
 *  por lo que la carga ocurre en el mount sin setState síncrono. */
export function TransactionDetailModal({
  transferId,
  userId,
  onClose,
}: TransactionDetailModalProps) {
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getTransfer(transferId)
      .then((t) => {
        if (!cancelled) setTransfer(t);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la transferencia",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [transferId]);

  const direction = transfer ? getTransferDirection(transfer, userId) : null;
  const isIncome = direction === "received";
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4"
      onClick={onClose}
      role="dialog"
      aria-label="Detalle de transacción"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-sm bg-bg-surface border border-border rounded-t-3xl sm:rounded-2xl p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          aria-label="Cerrar"
        >
          <X size={16} weight="bold" />
        </button>

        <h3 className="text-base font-bold text-text-primary pr-8">
          Detalle de transacción
        </h3>

        {loading ? (
          <div className="mt-6 space-y-4">
            <Skeleton className="w-16 h-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-40 mx-auto" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-36" />
                </div>
              ))}
            </div>
          </div>
        ) : error || !transfer ? (
          <p
            role="alert"
            className="mt-6 text-sm font-medium text-error text-center"
          >
            {error || "Transferencia no encontrada"}
          </p>
        ) : (
          <div className="mt-5 space-y-5">
            {/* Icon + amount + status */}
            <div className="flex flex-col items-center gap-2 pb-4 border-b border-border">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isIncome
                    ? "bg-accent-cyan/15 text-accent-cyan"
                    : "bg-primary/15 text-primary"
                }`}
              >
                <Icon size={26} weight="bold" />
              </div>
              <p
                className={`text-3xl font-extrabold tracking-tight ${
                  isIncome ? "text-success" : "text-text-primary"
                }`}
              >
                {isIncome ? "+" : "-"}${formatTransferMoney(transfer.amount)}
              </p>
              <StatusPill status={transfer.status} />
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs text-text-muted shrink-0">Tipo</span>
                <span className="text-xs font-semibold text-text-primary">
                  {isIncome
                    ? "Ingreso · Transferencia recibida"
                    : "Egreso · Transferencia enviada"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs text-text-muted shrink-0">De</span>
                <span className="text-xs text-text-secondary text-right">
                  <span className="block font-semibold text-text-primary">
                    {transfer.sender.name}
                  </span>
                  {transfer.sender.email}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs text-text-muted shrink-0">Para</span>
                <span className="text-xs text-text-secondary text-right">
                  <span className="block font-semibold text-text-primary">
                    {transfer.receiver.name}
                  </span>
                  {transfer.receiver.email}
                </span>
              </div>
              {transfer.concept && (
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-text-muted shrink-0">Concepto</span>
                  <span className="text-xs text-text-secondary text-right">
                    {transfer.concept}
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs text-text-muted shrink-0">Referencia</span>
                <span className="text-xs font-mono text-text-secondary">
                  {transfer.reference}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs text-text-muted shrink-0">Fecha</span>
                <span className="text-xs text-text-secondary">
                  {new Date(transfer.created_at).toLocaleString("es-VE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
