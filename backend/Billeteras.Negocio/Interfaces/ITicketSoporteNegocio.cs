using Billeteras.Negocio.Dtos;

namespace Billeteras.Negocio.Interfaces;

public interface ITicketSoporteNegocio
{
    /// <summary>Lista resumida de tickets del usuario autenticado.</summary>
    Task<List<TicketResumenResponse>> ObtenerMisAsync(int usuarioId);

    /// <summary>Detalle completo de un ticket (con mensajes y adjuntos).</summary>
    Task<TicketDetalleResponse?> ObtenerDetalleAsync(int ticketId);

    /// <summary>
    /// Crea cabecera + primer mensaje + adjuntos en una sola transacción.
    /// Devuelve el detalle completo del ticket recién creado.
    /// </summary>
    Task<TicketDetalleResponse> CrearAsync(int usuarioId, CrearTicketRequest req);
}
