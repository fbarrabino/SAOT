/**
 * WalletsContext.tsx — Estado global de billeteras y actividad
 *
 * Provee a toda la app:
 *  - wallets: billeteras del usuario (saldos, nombre, gradiente)
 *  - activity: historial unificado de movimientos
 *  - isLoading: true mientras se cargan datos del backend
 *  - error: mensaje de error si algo falló
 *  - refresh(): vuelve a pedir datos al backend (útil post-transacción)
 *
 * Carga billeteras y movimientos EN PARALELO con Promise.allSettled,
 * así si uno falla el otro igual llega.
 *
 * Uso:
 *   // En _layout.tsx (dentro de SessionProvider):
 *   <WalletsProvider enabled={isAuthenticated}><App /></WalletsProvider>
 *
 *   // En home.tsx, wallets.tsx, activity.tsx:
 *   const { wallets, activity, isLoading, refresh } = useWallets();
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { fetchMisCuentas } from '@/api/cuentas';
import { fetchMisMovimientos } from '@/api/movimientos';
import type { Wallet } from '@/data/wallets';
import type { ActivityItem } from '@/data/activity';

// ─── Tipos del contexto ───────────────────────────────────────────────────────

interface WalletsState {
  wallets: Wallet[];
  activity: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const WalletsContext = createContext<WalletsState | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface WalletsProviderProps {
  children: ReactNode;
  /**
   * Cuando es false (usuario no autenticado), el provider limpia los datos
   * y no hace requests. Cuando pasa a true, dispara la carga inicial.
   */
  enabled: boolean;
}

export function WalletsProvider({ children, enabled }: WalletsProviderProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Lanzamos ambas peticiones en paralelo para mayor velocidad.
      // Promise.allSettled garantiza que aunque una falle, la otra igual se procesa.
      const [resultCuentas, resultMovimientos] = await Promise.allSettled([
        fetchMisCuentas(),
        fetchMisMovimientos(),
      ]);

      // ── Billeteras ──────────────────────────────────────────────────────────
      if (resultCuentas.status === 'fulfilled') {
        setWallets(resultCuentas.value);
      } else {
        console.error('[WalletsContext] Error cargando cuentas:', resultCuentas.reason);
        setError('No se pudieron cargar las billeteras.');
        // wallets queda con su valor anterior (o el mock si es la primera carga)
      }

      // ── Movimientos ─────────────────────────────────────────────────────────
      if (resultMovimientos.status === 'fulfilled') {
        setActivity(resultMovimientos.value);
      } else {
        console.error('[WalletsContext] Error cargando movimientos:', resultMovimientos.reason);
        // Solo sobreescribimos el error si billeteras también falló
        if (resultCuentas.status === 'rejected') {
          setError('No se pudieron cargar los datos. Verificá tu conexión.');
        }
      }
    } catch (unexpectedErr) {
      // Este catch es por si Promise.allSettled mismo lanza (prácticamente imposible)
      console.error('[WalletsContext] Error inesperado en refresh:', unexpectedErr);
      setError('Error inesperado al actualizar los datos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial / limpieza al cambiar estado de autenticación
  useEffect(() => {
    if (enabled) {
      refresh();
    } else {
      // Usuario deslogueado: limpiamos los datos
      setWallets([]);
      setActivity([]);
      setError(null);
    }
  }, [enabled, refresh]);

  return (
    <WalletsContext.Provider value={{ wallets, activity, isLoading, error, refresh }}>
      {children}
    </WalletsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWallets(): WalletsState {
  const ctx = useContext(WalletsContext);
  if (!ctx) {
    throw new Error('useWallets() debe usarse dentro de <WalletsProvider>.');
  }
  return ctx;
}
