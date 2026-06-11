// Timeline unificado de movimientos (todas las billeteras juntas) para la tab Actividad.
// Agrupado por "bucket" temporal (HOY / AYER / fecha) — el listado ya viene ordenado.
import type { WalletKey } from './wallets';

export type ActivityItem = {
  id: string;
  bucket: string;       // 'HOY', 'AYER', '10 MAY', etc.
  wallet: WalletKey;
  title: string;        // Descripción del movimiento
  walletName: string;   // Mercado Pago, Ualá, Lemon
  time: string;         // '14:22'
  amount: number;       // negativo = egreso, positivo = ingreso
  kind: 'in' | 'out';
};

export const ACTIVITY: ActivityItem[] = [
  { id: 'a1', bucket: 'HOY',    wallet: 'mp', title: 'Supermercado',          walletName: 'Mercado Pago', time: '14:22', amount: -45.20,   kind: 'out' },
  { id: 'a2', bucket: 'HOY',    wallet: 'ua', title: 'Transferencia recibida', walletName: 'Ualá',         time: '09:08', amount: +200.00,  kind: 'in' },
  { id: 'a3', bucket: 'AYER',   wallet: 'lm', title: 'Compra online',          walletName: 'Lemon',        time: '21:46', amount: -120.50,  kind: 'out' },
  { id: 'a4', bucket: 'AYER',   wallet: 'mp', title: 'Café',                   walletName: 'Mercado Pago', time: '09:12', amount: -6.80,    kind: 'out' },
  { id: 'a5', bucket: '10 MAY', wallet: 'ua', title: 'Sueldo',                 walletName: 'Ualá',         time: '08:00', amount: +1850.00, kind: 'in' },
  { id: 'a6', bucket: '9 MAY',  wallet: 'lm', title: 'Alquiler',               walletName: 'Lemon',        time: '16:38', amount: -300.00,  kind: 'out' },
];
