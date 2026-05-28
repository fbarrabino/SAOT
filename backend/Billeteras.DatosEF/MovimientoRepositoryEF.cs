using Microsoft.EntityFrameworkCore;
using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;

namespace Billeteras.DatosEF;

/// Implementación EF Core del repositorio de Movimiento.
/// Incluye las navegaciones Categoria y CuentaBilletera con .Include(...).
/// NOTA: NO toca el SaldoActual de la cuenta (eso es TP-06).
public class MovimientoRepositoryEF(BilleterasContext ctx) : IMovimientoRepository
{
    public async Task<List<Movimiento>> ObtenerTodosAsync()
        => await ctx.Movimientos
            .Include(m => m.Categoria)
            .Include(m => m.CuentaBilletera)
            .ToListAsync();

    public async Task<Movimiento?> ObtenerPorIdAsync(int id)
        => await ctx.Movimientos
            .Include(m => m.Categoria)
            .Include(m => m.CuentaBilletera)
            .FirstOrDefaultAsync(m => m.MovimientoId == id);

    public async Task<int> InsertarAsync(Movimiento entidad)
    {
        ctx.Movimientos.Add(entidad);
        await ctx.SaveChangesAsync();
        return entidad.MovimientoId;
    }

    public async Task<bool> ActualizarAsync(Movimiento entidad)
    {
        ctx.Movimientos.Update(entidad);
        return await ctx.SaveChangesAsync() > 0;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var entidad = await ctx.Movimientos.FindAsync(id);
        if (entidad is null) return false;
        ctx.Movimientos.Remove(entidad);
        return await ctx.SaveChangesAsync() > 0;
    }
}