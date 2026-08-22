import { api } from '../config/api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return api<AuthResponse>('/login', { method: 'POST', json: data });
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return api<AuthResponse>('/register', { method: 'POST', json: data });
}

export async function getMe(): Promise<User> {
  return api<User>('/me');
}

export async function logout(): Promise<void> {
  await api('/logout', { method: 'POST' });
}
