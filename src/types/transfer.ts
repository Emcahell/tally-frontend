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
