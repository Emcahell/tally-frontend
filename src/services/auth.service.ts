import { api, API_BASE } from '../config/api';
import type { LoginRequest, RegisterRequest, AuthResponse, User, ProfileData } from '../types/auth';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return api<AuthResponse>('/login', { method: 'POST', json: data });
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return api<AuthResponse>('/register', { method: 'POST', json: data });
}

interface MeResponse {
  user: User;
}

export async function getMe(): Promise<User> {
  const response = await api<MeResponse>('/me');
  return response.user;
}

interface ProfileResponse {
  user: ProfileData;
}

export async function getProfile(): Promise<ProfileData> {
  const response = await api<ProfileResponse>('/profile');
  return response.user;
}

interface UpdateProfileRequest {
  name: string;
  phone: string;
  email: string;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<ProfileData> {
  const response = await api<ProfileResponse>('/profile', { method: 'PUT', json: data });
  return response.user;
}

export async function uploadPhoto(file: File): Promise<string> {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(`${API_BASE}/profile/photo`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al subir foto' }));
    throw new Error(error.message || 'Error al subir foto');
  }

  const data = await response.json();
  return data.photo ?? data.url ?? data.data?.photo ?? '';
}

export async function logout(): Promise<void> {
  await api('/logout', { method: 'POST' });
}
