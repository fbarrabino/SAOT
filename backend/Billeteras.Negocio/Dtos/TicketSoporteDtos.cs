namespace Billeteras.Negocio.Dtos;

// ── Requests ──────────────────────────────────────────────────────────────────

/// <summary>Adjunto incluido en la creación del ticket (URL ya subida al storage).</summary>
public record AdjuntoRequest(string UrlArchivo, string TipoMime);

/// <summary>
/// Cuerpo del POST /api/tickets-soporte.
/// El usuario reporta un problema: elige motivo, escribe el primer mensaje
/// y opcionalmente adjunta capturas/archivos.
/// </summary>
public record CrearTicketRequest(
    int MotivoId,
    string CuerpoMensaje,
    List<AdjuntoRequest> Adjuntos);

// ── Responses ─────────────────────────────────────────────────────────────────

public record AdjuntoResponse(int AdjuntoId, string UrlArchivo, string TipoMime);

public record MensajeResponse(
    int MensajeId,
    bool RemitenteEsSoporte,
    string CuerpoMensaje,
    DateTime FechaEnvio,
    List<AdjuntoResponse> Adjuntos);

/// <summary>Detalle completo de un ticket (cabecera + mensajes + adjuntos).</summary>
public record TicketDetalleResponse(
    int TicketId,
    int UsuarioId,
    int MotivoId,
    string MotivoTitulo,
    DateTime FechaCreacion,
    string Estado,
    List<MensajeResponse> Mensajes);

/// <summary>Resumen para la lista GET /me (sin mensajes completos).</summary>
public record TicketResumenResponse(
    int TicketId,
    int MotivoId,
    string MotivoTitulo,
    DateTime FechaCreacion,
    string Estado,
    int CantidadMensajes);

// ── DTOs legacy (mantenidos para compatibilidad hacia atrás) ──────────────────
public class TicketSoporteDto
{
    public int TicketId { get; set; }
    public int UsuarioId { get; set; }
    public int MotivoId { get; set; }
    public DateTime FechaCreacion { get; set; }
    public string Estado { get; set; } = string.Empty;
}

public class CreateTicketSoporteDto
{
    public int UsuarioId { get; set; }
    public int MotivoId { get; set; }
}
