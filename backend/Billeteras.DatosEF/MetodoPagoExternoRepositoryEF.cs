using Microsoft.EntityFrameworkCore;
using Billeteras.Entidades;
using Billeteras.Datos.Interfaces;

namespace Billeteras.DatosEF;

public class MetodoPagoExternoRepositoryEF(BilleterasContext context) : IMetodoPagoExternoRepository
{
    public async Task<IEnumerable<MetodoPagoExterno>> GetAllAsync() 
        => await context.MetodosPagoExternos.ToListAsync();

    public async Task<MetodoPagoExterno?> GetByIdAsync(int id) 
        => await context.MetodosPagoExternos.FindAsync(id);

    public async Task<IEnumerable<MetodoPagoExterno>> GetByUsuarioIdAsync(int usuarioId) 
        => await context.MetodosPagoExternos.Where(m => m.UsuarioId == usuarioId).ToListAsync();

    public async Task<MetodoPagoExterno> AddAsync(MetodoPagoExterno metodo)
    {
        context.MetodosPagoExternos.Add(metodo);
        await context.SaveChangesAsync();
        return metodo;
    }

    public async Task DeleteAsync(int id)
    {
        var metodo = await context.MetodosPagoExternos.FindAsync(id);
        if (metodo != null)
        {
            context.MetodosPagoExternos.Remove(metodo);
            await context.SaveChangesAsync();
        }
    }
}