using Billeteras.Negocio.Dtos;

namespace Billeteras.Negocio.Interfaces;

/// Servicio de negocio para Solicitudes de Cobro (Maestro-Detalle).
public interface ISolicitudCobroNegocio
{
    /// Devuelve el resumen de todas las solicitudes donde el usuario es el solicitante.
    Task<List<SolicitudCobroResumenResponse>> ObtenerMisAsync(int usuarioSolicitanteId);

    /// Devuelve el detalle completo (cabecera + líneas) de una solicitud.
    Task<SolicitudCobroDetalleResponse?> ObtenerDetalleAsync(int solicitudId);

    /// Crea una solicitud con su cabecera y líneas. Calcula MontoTotal sumando las líneas.
    Task<SolicitudCobroDetalleResponse> CrearAsync(int usuarioSolicitanteId, SolicitudCobroRequest req);

    /// El usuario deudor paga una línea: se registra el Movimiento y se marca como pagada.
    /// Retorna el MovimientoId generado.
    Task<int> PagarLineaAsync(int detalleSolicitudId, int cuentaBilleteraDeudorId, int categoriaId);
}
