using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

public interface ITicketSoporteRepository
{
    Task<IEnumerable<TicketSoporte>> GetAllAsync();
    Task<TicketSoporte?> GetByIdAsync(int id);
    Task<IEnumerable<TicketSoporte>> GetByUsuarioIdAsync(int usuarioId);
    Task<TicketSoporte> AddAsync(TicketSoporte ticket);
    Task UpdateEstadoAsync(int id, string nuevoEstado);
}