using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

public interface ITicketSoporteRepository
{
    Task<IEnumerable<TicketSoporte>> GetAllAsync();
    Task<TicketSoporte?> GetByIdAsync(int id);
    Task<IEnumerable<TicketSoporte>> GetByUsuarioIdAsync(int usuarioId);
    Task<TicketSoporte> AddAsync(TicketSoporte ticket);
    Task UpdateEstadoAsync(int id, string nuevoEstado);

    // Maestro-detalle (BE-07)
    /// <summary>
    /// Crea el ticket (cabecera) + su primer mensaje + adjuntos del mensaje
    /// dentro de una única transacción de BD. Devuelve el TicketId generado.
    /// </summary>
    Task<int> CrearConMensajeYAdjuntosAsync(
        TicketSoporte ticket,
        TicketMensaje mensaje,
        List<TicketAdjunto> adjuntos);

    /// <summary>
    /// Devuelve el ticket con sus mensajes y adjuntos cargados (eager loading).
    /// </summary>
    Task<TicketSoporte?> ObtenerConMensajesAsync(int ticketId);
}