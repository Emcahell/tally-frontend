export interface TransferParty {
  id: number;
  name: string;
  email: string;
}

export interface Transfer {
  id: number;
  reference: string;
  amount: number;
  concept: string | null;
  status: string;
  sender: TransferParty;
  receiver: TransferParty;
  created_at: string;
}

export interface TransferResponse {
  message: string;
  transfer: Transfer;
}

export interface SendTransferRequest {
  receiver_email: string;
  amount: number;
  concept?: string;
}

export interface PayeeUser {
  id: number;
  name: string;
  email: string;
  account_number: string;
}

export interface FrequentPayee {
  id: number;
  alias: string | null;
  payee: PayeeUser;
  created_at: string;
}

export interface AddPayeeResponse {
  message: string;
  payee: {
    id: number;
    alias: string | null;
    payee: PayeeUser;
  };
}

/** Respuesta paginada estilo Laravel Paginator de GET /transfers */
export interface PaginatedTransfers {
  current_page: number;
  data: Transfer[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}
