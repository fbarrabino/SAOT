using Microsoft.EntityFrameworkCore;
using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;

namespace Billeteras.DatosEF;

/// Implementación EF Core del repositorio de CuentaBilletera.
/// Incluye las navegaciones Billetera y Usuario con .Include(...).
public class CuentaBilleteraRepositoryEF(BilleterasContext ctx) : ICuentaBilleteraRepository
{
    public async Task<List<CuentaBilletera>> ObtenerTodosAsync()
        => await ctx.CuentasBilletera
            .Include(c => c.Billetera)
            .Include(c => c.Usuario)
            .ToListAsync();

    public async Task<CuentaBilletera?> ObtenerPorIdAsync(int id)
        => await ctx.CuentasBilletera
            .Include(c => c.Billetera)
            .Include(c => c.Usuario)
            .FirstOrDefaultAsync(c => c.CuentaBilleteraId == id);

    public async Task<int> InsertarAsync(CuentaBilletera entidad)
    {
        ctx.CuentasBilletera.Add(entidad);
        await ctx.SaveChangesAsync();
        return entidad.CuentaBilleteraId;
    }

    public async Task<bool> ActualizarAsync(CuentaBilletera entidad)
    {
        ctx.CuentasBilletera.Update(entidad);
        return await ctx.SaveChangesAsync() > 0;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var entidad = await ctx.CuentasBilletera.FindAsync(id);
        if (entidad is null) return false;
        ctx.CuentasBilletera.Remove(entidad);
        return await ctx.SaveChangesAsync() > 0;
    }
}