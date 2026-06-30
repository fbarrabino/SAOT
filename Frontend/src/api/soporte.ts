/**
 * soporte.ts — Servicio de tickets de soporte
 *
 * Endpoints:
 *   POST /api/tickets-soporte        → crea ticket (soporte general o reporte de transacción)
 *   GET  /api/tickets-soporte/me     → lista tickets del usuario
 *   GET  /api/tickets-soporte/{id}   → detalle de un ticket
 */

import { api } from './client';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AdjuntoRequest {
  urlArchivo: string;
  tipoMime: string;
}

export interface CrearTicketRequest {
  motivoId: number;
  cuerpoMensaje: string;
  adjuntos: AdjuntoRequest[];
}

export interface AdjuntoResponse {
  adjuntoId: number;
  urlArchivo: string;
  tipoMime: string;
}

export interface MensajeResponse {
  mensajeId: number;
  remitenteEsSoporte: boolean;
  cuerpoMensaje: string;
  fechaEnvio: string;
  adjuntos: AdjuntoResponse[];
}

export interface TicketDetalleResponse {
  ticketId: number;
  usuarioId: number;
  motivoId: number;
  motivoTitulo: string;
  fechaCreacion: string;
  estado: string;
  mensajes: MensajeResponse[];
}

export interface TicketResumenResponse {
  ticketId: number;
  motivoId: number;
  motivoTitulo: string;
  fechaCreacion: string;
  estado: string;
  cantidadMensajes: number;
}

// ─── Motivos hardcodeados para soporte general (FE-10) ───────────────────────
// Mapeados a los MotivoId del seed de la DB (1-4).

export const TEMAS_SOPORTE = [
  { label: 'Pagos',      motivoId: 1 },
  { label: 'Billeteras', motivoId: 2 },
  { label: 'Cuenta',     motivoId: 3 },
  { label: 'Otro',       motivoId: 4 },
] as const;

// ─── Motivos hardcodeados para reporte de transacción (FE-13) ────────────────
// Los labels siguen el diseño; los MotivoId mapean a los 4 existentes en DB.

export const MOTIVOS_REPORTE = [
  { label: 'No reconozco la transacción', motivoId: 1 },
  { label: 'El monto es incorrecto',      motivoId: 2 },
  { label: 'No recibí lo que pagué',      motivoId: 1 },
  { label: 'Pago duplicado',              motivoId: 1 },
  { label: 'Datos incorrectos',           motivoId: 2 },
  { label: 'Otro',                        motivoId: 4 },
] as const;

// ─── Funciones públicas ───────────────────────────────────────────────────────

/**
 * POST /api/tickets-soporte
 * Crea un ticket de soporte con primer mensaje (y adjuntos opcionales).
 * Devuelve el detalle completo incluyendo el TicketId asignado.
 */
export async function crearTicket(
  req: CrearTicketRequest,
): Promise<TicketDetalleResponse> {
  return api.post<TicketDetalleResponse>('/api/tickets-soporte', req);
}

/**
 * GET /api/tickets-soporte/me
 * Lista los tickets del usuario autenticado.
 */
export async function fetchMisTickets(): Promise<TicketResumenResponse[]> {
  return api.get<TicketResumenResponse[]>('/api/tickets-soporte/me');
}

/**
 * GET /api/tickets-soporte/{id}
 * Detalle completo de un ticket (cabecera + mensajes + adjuntos).
 */
export async function fetchTicket(id: number): Promise<TicketDetalleResponse> {
  return api.get<TicketDetalleResponse>(`/api/tickets-soporte/${id}`);
}
