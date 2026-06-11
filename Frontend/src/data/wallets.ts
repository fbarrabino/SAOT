// Single source of truth de las billeteras del usuario para los flujos del bloque 2.
// Saldos hard-coded (mismos números que usa la home del bloque 1 y el saot-demo.js de ref).
// Cuando se conecte al backend esto se reemplaza por un fetch a /api/cuentas-billetera.
import { gradients } from '@/theme/tokens';

export type WalletKey = 'mp' | 'ua' | 'lm';

export type Wallet = {
  key: WalletKey;
  name: string;
  short: string;
  bal: number;
  tint: readonly [string, string];
};

export const WALLETS: Wallet[] = [
  { key: 'mp', name: 'Mercado Pago', short: 'Mercado Pago', bal: 3200.5, tint: gradients.mpTint },
  { key: 'ua', name: 'Ualá', short: 'Ualá', bal: 1500.0, tint: gradients.uaTint },
  { key: 'lm', name: 'Lemon', short: 'Lemon', bal: 7749.75, tint: gradients.lmTint },
];

export const findWallet = (k: WalletKey) => WALLETS.find(w => w.key === k)!;
