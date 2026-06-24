using Microsoft.EntityFrameworkCore;
using Billeteras.Entidades;
using Billeteras.Datos.Interfaces;

namespace Billeteras.DatosEF;

public class TicketSoporteRepositoryEF(BilleterasContext context) : ITicketSoporteRepository
{
    public async Task<IEnumerable<TicketSoporte>> GetAllAsync() 
        => await context.TicketsSoporte.ToListAsync();

    public async Task<TicketSoporte?> GetByIdAsync(int id) 
        => await context.TicketsSoporte.FindAsync(id);

    public async Task<IEnumerable<TicketSoporte>> GetByUsuarioIdAsync(int usuarioId) 
        => await context.TicketsSoporte.Where(t => t.UsuarioId == usuarioId).ToListAsync();

    public async Task<TicketSoporte> AddAsync(TicketSoporte ticket)
    {
        context.TicketsSoporte.Add(ticket);
        await context.SaveChangesAsync();
        return ticket;
    }

    public async Task UpdateEstadoAsync(int id, string nuevoEstado)
    {
        var ticket = await context.TicketsSoporte.FindAsync(id);
        if (ticket != null)
        {
            ticket.Estado = nuevoEstado;
            await context.SaveChangesAsync();
        }
    }
}