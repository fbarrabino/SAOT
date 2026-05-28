using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

public interface ICategoriaRepository
{
    Task<List<Categoria>> ObtenerTodosAsync();
    Task<Categoria?> ObtenerPorIdAsync(int id);
    Task<int> InsertarAsync(Categoria entidad);
    Task<bool> ActualizarAsync(Categoria entidad);
    Task<bool> EliminarAsync(int id);
}