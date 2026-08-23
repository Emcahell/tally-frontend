import { api } from '../config/api';
import type { Account } from '../types/auth';

interface AccountResponse {
  account: Account;
}

export async function getAccount(): Promise<Account> {
  const response = await api<AccountResponse>('/account');
  return response.account;
}
