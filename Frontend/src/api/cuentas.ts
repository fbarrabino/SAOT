import { api } from './client';
import { gradients } from '@/theme/tokens';
import { MOCK_WALLETS } from '@/data/wallets';
import type { Wallet, WalletKey } from '@/data/wallets';

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

function toWalletKey(nombre: string | null): WalletKey | null {
  const n = (nombre ?? '').toLowerCase().trim();
  if (n.includes('mercado') || n.includes('mp')) return 'mp';
  if (n.includes('ual')) return 'ua';
  if (n.includes('lemon') || n.includes('lm')) return 'lm';
  return null;
}

function toGradient(key: WalletKey): readonly [string, string] {
  const map: Record<string, readonly [string, string]> = {
    mp: gradients.mpTint,
    ua: gradients.uaTint,
    lm: gradients.lmTint,
  };
  return map[key] || gradients.mpTint;
}

export function cuentaToWallet(cuenta: CuentaBilleteraResponse): Wallet | null {
  const key = toWalletKey(cuenta.billeteraNombre);
  if (key === null) return null;

  return {
    key,
    name: cuenta.billeteraNombre ?? key,
    short: cuenta.alias ?? cuenta.billeteraNombre ?? key,
    bal: cuenta.saldoActual,
    tint: toGradient(key),
    cuentaId: cuenta.cuentaBilleteraId,
  };
}

export async function fetchMisCuentas(): Promise<Wallet[]> {
  try {
    const cuentas = await api.get<CuentaBilleteraResponse[]>('/api/cuentas-billetera/me');
    if (!Array.isArray(cuentas)) return MOCK_WALLETS;

    const wallets = cuentas.map(cuentaToWallet).filter((w): w is Wallet => w !== null);
    if (wallets.length === 0) return MOCK_WALLETS;

    return wallets;
  } catch (err) {
    console.warn('[cuentas] Error al obtener cuentas. Usando mock.', err);
    return MOCK_WALLETS;
  }
}

// Nueva función para B4-FE
export async function vincularCuentaBilletera(billeteraId: number, alias: string, saldoInicial: number): Promise<CuentaBilleteraResponse> {
  const req = {
    billeteraId,
    alias,
    saldoInicial
  };
  return await api.post<CuentaBilleteraResponse>('/api/cuentas-billetera', req);
}