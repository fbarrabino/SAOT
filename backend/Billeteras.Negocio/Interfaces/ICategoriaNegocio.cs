using Billeteras.Negocio.Dtos;

namespace Billeteras.Negocio.Interfaces;

public interface ICategoriaNegocio
{
    Task<List<CategoriaResponse>> ObtenerTodosAsync();
    Task<CategoriaResponse?> ObtenerPorIdAsync(int id);
    Task<CategoriaResponse> CrearAsync(CategoriaRequest req);
    Task<CategoriaResponse?> ActualizarAsync(int id, CategoriaRequest req);
    Task<bool> EliminarAsync(int id);
}