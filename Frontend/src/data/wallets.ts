/**
 * wallets.ts — Tipos y datos de fallback de billeteras
 *
 * MOCK_WALLETS: datos hardcodeados que se usan SOLO cuando el backend
 * no está disponible (modo desarrollo). En producción los datos reales
 * vienen de GET /api/cuentas-billetera/me vía src/api/cuentas.ts.
 *
 * WALLETS se mantiene como alias de MOCK_WALLETS para no romper
 * imports existentes mientras se termina la migración.
 */
import { gradients } from '@/theme/tokens';

export type WalletKey = 'mp' | 'ua' | 'lm';

export type Wallet = {
  key: WalletKey;
  name: string;
  short: string;
  bal: number;
  tint: readonly [string, string];
};

/** Datos de desarrollo — solo se usan si el backend no responde. */
export const MOCK_WALLETS: Wallet[] = [
  { key: 'mp', name: 'Mercado Pago', short: 'Mercado Pago', bal: 3200.5,  tint: gradients.mpTint },
  { key: 'ua', name: 'Ualá',         short: 'Ualá',         bal: 1500.0,  tint: gradients.uaTint },
  { key: 'lm', name: 'Lemon',        short: 'Lemon',        bal: 7749.75, tint: gradients.lmTint },
];

/** @deprecated Usar MOCK_WALLETS o el contexto WalletsContext. */
export const WALLETS = MOCK_WALLETS;

/** Busca una billetera en la lista dada (por defecto el mock). */
export const findWallet = (k: WalletKey, wallets: Wallet[] = MOCK_WALLETS) =>
  wallets.find(w => w.key === k)!;
