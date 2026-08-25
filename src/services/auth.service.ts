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
  if (response.user.photo) {
    response.user.photo = resolvePhotoUrl(response.user.photo);
  }
  return response.user;
}

interface ProfileResponse {
  user: ProfileData;
}

export async function getProfile(): Promise<ProfileData> {
  const response = await api<ProfileResponse>('/profile');
  if (response.user.photo) {
    response.user.photo = resolvePhotoUrl(response.user.photo);
  }
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

function resolvePhotoUrl(url: string): string {
  if (!url) return '';
  // If already absolute, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Build absolute URL from backend origin
  const backendOrigin = API_BASE.replace(/\/api\/?$/, '');
  return `${backendOrigin}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function uploadPhoto(file: File): Promise<string> {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('photo', file);

  // Try with /api prefix first
  const url = `${API_BASE}/profile/photo`;
  console.log('[uploadPhoto] POST', url, 'size:', file.size, 'type:', file.type);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  console.log('[uploadPhoto] Response:', response.status, response.statusText);

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const body = await response.text();
    console.error('[uploadPhoto] Error body:', body);
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('[uploadPhoto] Success:', data);
  // Handle Laravel API Resource wrapping
  const raw = data.data?.photo ?? data.photo ?? data.url ?? '';
  return resolvePhotoUrl(raw);
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await api('/password', { method: 'POST', json: data });
}

export async function logout(): Promise<void> {
  await api('/logout', { method: 'POST' });
}
