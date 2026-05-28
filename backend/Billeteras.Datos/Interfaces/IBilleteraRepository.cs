using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

public interface IBilleteraRepository
{
    Task<List<Billetera>> ObtenerTodosAsync();
    Task<Billetera?> ObtenerPorIdAsync(int id);
    Task<int> InsertarAsync(Billetera entidad);
    Task<bool> ActualizarAsync(Billetera entidad);
    Task<bool> EliminarAsync(int id);
}