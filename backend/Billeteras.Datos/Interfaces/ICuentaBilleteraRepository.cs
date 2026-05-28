using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

public interface ICuentaBilleteraRepository
{
    Task<List<CuentaBilletera>> ObtenerTodosAsync();
    Task<CuentaBilletera?> ObtenerPorIdAsync(int id);
    Task<int> InsertarAsync(CuentaBilletera entidad);
    Task<bool> ActualizarAsync(CuentaBilletera entidad);
    Task<bool> EliminarAsync(int id);
}