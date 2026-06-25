using Microsoft.EntityFrameworkCore;
using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;

namespace Billeteras.DatosEF;

/// Implementación EF Core del repositorio de Usuario.
public class UsuarioRepositoryEF(BilleterasContext ctx) : IUsuarioRepository
{
    public async Task<List<Usuario>> ObtenerTodosAsync()
        => await ctx.Usuarios.ToListAsync();

    public async Task<Usuario?> ObtenerPorIdAsync(int id)
        => await ctx.Usuarios.FindAsync(id);

    public async Task<Usuario?> ObtenerPorEmailAsync(string email)
        => await ctx.Usuarios.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<int> InsertarAsync(Usuario entidad)
    {
        ctx.Usuarios.Add(entidad);
        await ctx.SaveChangesAsync();
        return entidad.UsuarioId;
    }

    public async Task<bool> ActualizarAsync(Usuario entidad)
    {
        ctx.Usuarios.Update(entidad);
        return await ctx.SaveChangesAsync() > 0;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var entidad = await ctx.Usuarios.FindAsync(id);
        if (entidad is null) return false;
        ctx.Usuarios.Remove(entidad);
        return await ctx.SaveChangesAsync() > 0;
    }

    public Task<List<string>> ObtenerNombresRolesAsync(int usuarioId)
        => (from ur in ctx.UsuariosRoles
            join r in ctx.Roles on ur.RolId equals r.RolId
            where ur.UsuarioId == usuarioId
            select r.Nombre).ToListAsync();
}