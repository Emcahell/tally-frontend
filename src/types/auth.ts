export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  photo: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}
