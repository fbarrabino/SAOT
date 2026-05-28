using Microsoft.EntityFrameworkCore;
using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;

namespace Billeteras.DatosEF;

/// Implementación EF Core del repositorio de Categoria.
public class CategoriaRepositoryEF(BilleterasContext ctx) : ICategoriaRepository
{
    public async Task<List<Categoria>> ObtenerTodosAsync()
        => await ctx.Categorias.ToListAsync();

    public async Task<Categoria?> ObtenerPorIdAsync(int id)
        => await ctx.Categorias.FindAsync(id);

    public async Task<int> InsertarAsync(Categoria entidad)
    {
        ctx.Categorias.Add(entidad);
        await ctx.SaveChangesAsync();
        return entidad.CategoriaId;
    }

    public async Task<bool> ActualizarAsync(Categoria entidad)
    {
        ctx.Categorias.Update(entidad);
        return await ctx.SaveChangesAsync() > 0;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var entidad = await ctx.Categorias.FindAsync(id);
        if (entidad is null) return false;
        ctx.Categorias.Remove(entidad);
        return await ctx.SaveChangesAsync() > 0;
    }
}