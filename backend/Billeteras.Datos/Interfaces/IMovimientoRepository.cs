using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

public interface IMovimientoRepository
{
    Task<List<Movimiento>> ObtenerTodosAsync();
    Task<Movimiento?> ObtenerPorIdAsync(int id);
    Task<int> InsertarAsync(Movimiento entidad);
    Task<bool> ActualizarAsync(Movimiento entidad);
    Task<bool> EliminarAsync(int id);
}