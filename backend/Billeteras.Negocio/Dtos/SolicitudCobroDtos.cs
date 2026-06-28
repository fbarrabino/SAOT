using System.ComponentModel.DataAnnotations;

namespace Billeteras.Negocio.Dtos;

// ── Requests ──────────────────────────────────────────────────────────────────

/// Línea de detalle dentro de una solicitud de cobro.
public record SolicitudCobroLineaRequest(
    [Required] int UsuarioDeudorId,
    [Required, Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a 0.")] decimal MontoMita,
    [MaxLength(250)] string? Concepto
);

/// Cabecera + líneas para crear una solicitud de cobro.
public record SolicitudCobroRequest(
    [MaxLength(250)] string? Descripcion,
    [Required] DateTime FechaVencimiento,
    [Required, MinLength(1, ErrorMessage = "Debe incluir al menos una línea.")] List<SolicitudCobroLineaRequest> Lineas
);

// ── Responses ─────────────────────────────────────────────────────────────────

/// Detalle (línea) devuelta en las respuestas.
public record SolicitudCobroLineaResponse(
    int DetalleSolicitudId,
    int SolicitudId,
    int UsuarioDeudorId,
    string? NombreDeudor,
    decimal MontoMita,
    string? Concepto,
    bool Pagado,
    int? MovimientoId
);

/// Cabecera de solicitud (sin líneas) — usada en listados.
public record SolicitudCobroResumenResponse(
    int SolicitudId,
    int UsuarioSolicitanteId,
    string? NombreSolicitante,
    string? Descripcion,
    decimal MontoTotal,
    DateTime FechaVencimiento,
    DateTime FechaCreacion,
    string Estado,
    int TotalLineas,
    int LineasPagadas
);

/// Cabecera + líneas — usada en el detalle (maestro-detalle completo).
public record SolicitudCobroDetalleResponse(
    int SolicitudId,
    int UsuarioSolicitanteId,
    string? NombreSolicitante,
    string? Descripcion,
    decimal MontoTotal,
    DateTime FechaVencimiento,
    DateTime FechaCreacion,
    string Estado,
    List<SolicitudCobroLineaResponse> Lineas
);
