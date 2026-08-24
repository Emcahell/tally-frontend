export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://tally-backend-ngfx.onrender.com/api';

interface RequestOptions extends RequestInit {
  json?: unknown;
}

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function api<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { json, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
    body: json ? JSON.stringify(json) : fetchOptions.body,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
    throw new Error(error.message || 'Error en la solicitud');
  }

  const data = await response.json();
  // Laravel API Resources wrap responses in { data: { ... } }
  if (
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    'data' in data &&
    Object.keys(data).every((k) => ['data', 'links', 'meta'].includes(k))
  ) {
    return (data as { data: T }).data;
  }
  return data as T;
}
