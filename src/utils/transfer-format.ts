import type { Transfer } from "../types/transfer";

export type TransferDirection = "sent" | "received";

/** Determina si la transferencia es un egreso (sent) o ingreso (received)
 *  comparando contra el id del usuario autenticado. */
export function getTransferDirection(
  transfer: Transfer,
  userId?: number,
): TransferDirection {
  if (userId != null && transfer.sender.id === userId) return "sent";
  return "received";
}

/** Nombre de la contraparte: beneficiario si es egreso, remitente si es ingreso */
export function getCounterpartyName(transfer: Transfer, userId?: number): string {
  return getTransferDirection(transfer, userId) === "sent"
    ? transfer.receiver.name
    : transfer.sender.name;
}

export function formatTransferMoney(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Fecha corta para listas: "24 ago · 10:00 AM" */
export function formatTransferDate(iso: string): string {
  const date = new Date(iso);
  const day = date.toLocaleDateString("es-VE", {
    day: "numeric",
    month: "short",
  });
  const time = date.toLocaleTimeString("es-VE", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} · ${time}`;
}
