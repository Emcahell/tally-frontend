import { api } from '../config/api';
import type {
  AddPayeeResponse,
  FrequentPayee,
  PaginatedTransfers,
  SendTransferRequest,
  Transfer,
  TransferResponse,
} from '../types/transfer';

export async function sendTransfer(data: SendTransferRequest): Promise<TransferResponse> {
  return api<TransferResponse>('/transfers', { method: 'POST', json: data });
}

/** Historial de transferencias paginado (Laravel Paginator, 20 por página) */
export async function getTransfers(page = 1): Promise<PaginatedTransfers> {
  return api<PaginatedTransfers>(`/transfers?page=${page}`);
}

/** Obtiene una transferencia específica por su id */
export async function getTransfer(id: number): Promise<Transfer> {
  const res = await api<{ transfer: Transfer }>(`/transfers/${id}`);
  return res.transfer;
}

export async function getFrequentPayees(): Promise<FrequentPayee[]> {
  const res = await api<{ payees?: FrequentPayee[] } | FrequentPayee[]>('/frequent-payees');
  if (Array.isArray(res)) return res;
  return res.payees ?? [];
}

export async function addFrequentPayee(data: {
  payee_email: string;
  alias?: string;
}): Promise<AddPayeeResponse> {
  return api<AddPayeeResponse>('/frequent-payees', { method: 'POST', json: data });
}

export async function updateFrequentPayee(id: number, alias: string): Promise<void> {
  await api(`/frequent-payees/${id}`, { method: 'PUT', json: { alias } });
}

export async function deleteFrequentPayee(id: number): Promise<void> {
  await api(`/frequent-payees/${id}`, { method: 'DELETE' });
}
