/**
 * auth.ts — Servicio de autenticación
 *
 * Cubre:
 *  - POST /api/auth/login   → recibe JWT, lo guarda en memoria
 *  - POST /api/auth/register → crea un usuario nuevo
 *  - GET  /api/auth/me      → valida y devuelve el usuario actual
 *  - logout                 → borra el token de memoria
 */

import { api, setToken, getToken, ApiError } from './client';

// ─── Tipos que devuelve el backend ────────────────────────────────────────────

export interface UsuarioResponse {
  usuarioId: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaAlta: string;
}

interface LoginResponse {
  token: string;
  expiresAt: string;
  usuario: UsuarioResponse;
}

// ─── Funciones públicas ───────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 *
 * Autentica el usuario y guarda el JWT en memoria.
 * Lanza ApiError con mensaje legible si:
 *   - El email o contraseña están vacíos (validación local)
 *   - Las credenciales son incorrectas (401 del backend)
 *   - El backend no responde (status 0)
 */
export async function login(
  email: string,
  password: string,
): Promise<UsuarioResponse> {
  // Validación local antes de hacer el request
  if (!email.trim()) {
    throw new ApiError(400, 'El email es obligatorio.');
  }
  if (!password.trim()) {
    throw new ApiError(400, 'La contraseña es obligatoria.');
  }

  try {
    const data = await api.post<LoginResponse>(
      '/api/auth/login',
      { email: email.trim().toLowerCase(), password },
      false, // endpoint público
    );

    setToken(data.token);
    return data.usuario;
  } catch (err) {
    // Re-lanzamos para que el contexto/componente los maneje
    // pero podemos enriquecer el mensaje antes
    if (err instanceof ApiError && err.status === 401) {
      throw new ApiError(401, 'Email o contraseña incorrectos.');
    }
    throw err;
  }
}

/**
 * POST /api/auth/register
 *
 * Registra un usuario nuevo. No inicia sesión automáticamente.
 * Lanza ApiError si el email ya está en uso (400 del backend).
 */
export async function register(
  nombre: string,
  apellido: string,
  email: string,
  password: string,
): Promise<UsuarioResponse> {
  if (!nombre.trim()) throw new ApiError(400, 'El nombre es obligatorio.');
  if (!apellido.trim()) throw new ApiError(400, 'El apellido es obligatorio.');
  if (!email.trim()) throw new ApiError(400, 'El email es obligatorio.');
  if (password.length < 6) {
    throw new ApiError(400, 'La contraseña debe tener al menos 6 caracteres.');
  }

  return api.post<UsuarioResponse>(
    '/api/auth/register',
    { nombre: nombre.trim(), apellido: apellido.trim(), email: email.trim().toLowerCase(), password },
    false,
  );
}

/**
 * GET /api/auth/me
 *
 * Verifica que el token actual sea válido y devuelve los datos del usuario.
 * Útil al volver a abrir la app (cuando tengamos persistencia con SecureStore).
 */
export async function me(): Promise<UsuarioResponse> {
  return api.get<UsuarioResponse>('/api/auth/me');
}

/**
 * Cierra la sesión local borrando el token de memoria.
 * No hay endpoint de logout en el backend (el JWT simplemente expira).
 */
export function logout(): void {
  setToken(null);
}

// Re-exportamos para no tener que importar desde 'client' en los contextos
export { getToken };
