/**
 * cuentas.ts — Servicio de cuentas/billeteras
 *
 * Endpoint: GET /api/cuentas-billetera/me
 * Devuelve las cuentas vinculadas del usuario autenticado y las convierte
 * al tipo Wallet que usan las pantallas del frontend.
 *
 * Estrategia de fallback:
 *   Si el backend no responde (red caída, backend en construcción),
 *   devuelve MOCK_WALLETS para que el desarrollo no se detenga.
 */

import { api } from './client';
import { gradients } from '@/theme/tokens';
import { MOCK_WALLETS } from '@/data/wallets';
import type { Wallet, WalletKey } from '@/data/wallets';

// ─── Tipo del backend ─────────────────────────────────────────────────────────

export interface CuentaBilleteraResponse {
  cuentaBilleteraId: number;
  usuarioId: number;
  billeteraId: number;
  alias: string | null;
  saldoActual: number;
  fechaVinculacion: string;
  billeteraNombre: string | null;
  usuarioNombre: string | null;
}

// ─── Helpers de mapeo ─────────────────────────────────────────────────────────

/** Convierte el nombre del backend ('Mercado Pago', 'Ualá', 'Lemon') al key interno. */
function toWalletKey(nombre: string | null): WalletKey | null {
  const n = (nombre ?? '').toLowerCase().trim();
  if (n.includes('mercado') || n.includes('mp')) return 'mp';
  if (n.includes('ual')) return 'ua';   // 'Ualá', 'Uala'
  if (n.includes('lemon') || n.includes('lm')) return 'lm';
  return null; // billetera desconocida — la ignoramos
}

/** Devuelve el gradiente correspondiente al key de billetera. */
function toGradient(key: WalletKey): readonly [string, string] {
  const map: Record<WalletKey, readonly [string, string]> = {
    mp: gradients.mpTint,
    ua: gradients.uaTint,
    lm: gradients.lmTint,
  };
  return map[key];
}

/**
 * Transforma una CuentaBilleteraResponse del backend al tipo Wallet del frontend.
 * Devuelve null si la billetera no es reconocida (key desconocida).
 */
export function cuentaToWallet(cuenta: CuentaBilleteraResponse): Wallet | null {
  const key = toWalletKey(cuenta.billeteraNombre);
  if (key === null) return null;

  return {
    key,
    name: cuenta.billeteraNombre ?? key,
    short: cuenta.alias ?? cuenta.billeteraNombre ?? key,
    bal: cuenta.saldoActual,
    tint: toGradient(key),
  };
}

// ─── Función pública ──────────────────────────────────────────────────────────

/**
 * GET /api/cuentas-billetera/me
 *
 * Devuelve las billeteras del usuario autenticado transformadas a Wallet[].
 *
 * Fallback: si el servidor no responde o devuelve un array vacío,
 * usa MOCK_WALLETS para que el desarrollo pueda continuar.
 */
export async function fetchMisCuentas(): Promise<Wallet[]> {
  try {
    const cuentas = await api.get<CuentaBilleteraResponse[]>('/api/cuentas-billetera/me');

    if (!Array.isArray(cuentas)) {
      console.warn('[cuentas] La respuesta del servidor no es un array. Usando mock.');
      return MOCK_WALLETS;
    }

    const wallets = cuentas
      .map(cuentaToWallet)
      .filter((w): w is Wallet => w !== null);

    if (wallets.length === 0) {
      console.warn('[cuentas] El servidor respondió pero sin billeteras reconocidas. Usando mock.');
      return MOCK_WALLETS;
    }

    return wallets;
  } catch (err) {
    // Error de red o del servidor — fallback silencioso en modo desarrollo
    console.warn('[cuentas] No se pudo conectar al backend. Usando mock de desarrollo:', err);
    return MOCK_WALLETS;
  }
}
