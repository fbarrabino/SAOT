using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Negocio;

public class CategoriaNegocio(ICategoriaRepository repo) : ICategoriaNegocio
{
    public async Task<List<CategoriaResponse>> ObtenerTodosAsync()
        => (await repo.ObtenerTodosAsync()).Select(Map).ToList();

    public async Task<CategoriaResponse?> ObtenerPorIdAsync(int id)
    {
        var categoria = await repo.ObtenerPorIdAsync(id);
        return categoria is null ? null : Map(categoria);
    }

    public async Task<CategoriaResponse> CrearAsync(CategoriaRequest req)
    {
        var categoria = new Categoria { Nombre = req.Nombre, Tipo = req.Tipo };
        categoria.CategoriaId = await repo.InsertarAsync(categoria);
        return Map(categoria);
    }

    public async Task<CategoriaResponse?> ActualizarAsync(int id, CategoriaRequest req)
    {
        var categoria = await repo.ObtenerPorIdAsync(id);
        if (categoria is null)
            return null;

        categoria.Nombre = req.Nombre;
        categoria.Tipo = req.Tipo;

        await repo.ActualizarAsync(categoria);
        return Map(categoria);
    }

    public Task<bool> EliminarAsync(int id) => repo.EliminarAsync(id);

    private static CategoriaResponse Map(Categoria c)
        => new(c.CategoriaId, c.Nombre, c.Tipo);
}