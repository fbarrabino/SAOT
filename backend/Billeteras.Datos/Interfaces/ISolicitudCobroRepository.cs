using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

/// Repositorio para el módulo Maestro-Detalle: Solicitudes de Cobro.
/// Los métodos de escritura (crear y pagar) ejecutan sus operaciones
/// dentro de una transacción de base de datos para garantizar atomicidad.
public interface ISolicitudCobroRepository
{
    /// Devuelve todas las solicitudes del usuario como solicitante, con sus líneas.
    Task<List<SolicitudCobro>> ObtenerPorSolicitanteAsync(int usuarioSolicitanteId);

    /// Devuelve el detalle completo (cabecera + líneas) de una solicitud.
    Task<SolicitudCobro?> ObtenerConLineasAsync(int solicitudId);

    /// Devuelve una línea de detalle por su id.
    Task<SolicitudCobroDetalle?> ObtenerDetalleAsync(int detalleSolicitudId);

    /// Crea la cabecera y todas las líneas en una única transacción de DB.
    /// Retorna el id de la solicitud creada.
    Task<int> CrearConLineasAsync(SolicitudCobro cabecera, List<SolicitudCobroDetalle> lineas);

    /// Marca la línea como pagada y registra el Movimiento correspondiente,
    /// todo dentro de una única transacción de DB.
    Task<int> PagarLineaAsync(SolicitudCobroDetalle detalle, Movimiento movimiento);
}
