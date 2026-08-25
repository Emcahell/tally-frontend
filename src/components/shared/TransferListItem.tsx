import { ArrowDownLeft, ArrowUpRight } from "phosphor-react";
import type { Transfer } from "../../types/transfer";
import {
  formatTransferDate,
  formatTransferMoney,
  getCounterpartyName,
  getTransferDirection,
} from "../../utils/transfer-format";

interface TransferListItemProps {
  transfer: Transfer;
  userId?: number;
  onClick?: () => void;
}

/** Fila de movimiento reutilizable: icono por dirección, contraparte,
 *  tipo + fecha a la izquierda y monto coloreado a la derecha.
 *  Ingreso → verde (+). Egreso → blanco (−). */
export function TransferListItem({
  transfer,
  userId,
  onClick,
}: TransferListItemProps) {
  const direction = getTransferDirection(transfer, userId);
  const isIncome = direction === "received";
  const typeLabel = isIncome ? "Recibido" : "Enviado";

  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
  const iconClass = isIncome
    ? "bg-accent-cyan/15 text-accent-cyan"
    : "bg-bg-surface border border-border text-text-secondary";

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`w-full flex items-center gap-3 py-3 text-left ${
        onClick ? "hover:opacity-80 active:opacity-60 transition-opacity" : ""
      }`}
      aria-label={`${typeLabel} ${formatTransferMoney(transfer.amount)} de ${getCounterpartyName(transfer, userId)}`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconClass}`}
      >
        <Icon size={20} weight="bold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">
          {getCounterpartyName(transfer, userId)}
        </p>
        <p className="text-xs text-text-muted">
          {typeLabel} · {formatTransferDate(transfer.created_at)}
        </p>
      </div>
      <span
        className={`text-sm font-bold shrink-0 ${
          isIncome ? "text-success" : "text-text-primary"
        }`}
      >
        {isIncome ? "+" : "-"}${formatTransferMoney(transfer.amount)}
      </span>
    </button>
  );
}
