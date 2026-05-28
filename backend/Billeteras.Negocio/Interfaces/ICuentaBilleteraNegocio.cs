using Billeteras.Negocio.Dtos;

namespace Billeteras.Negocio.Interfaces;

public interface ICuentaBilleteraNegocio
{
    Task<List<CuentaBilleteraResponse>> ObtenerTodosAsync();
    Task<CuentaBilleteraResponse?> ObtenerPorIdAsync(int id);
    Task<CuentaBilleteraResponse> CrearAsync(CuentaBilleteraRequest req);
    Task<CuentaBilleteraResponse?> ActualizarAsync(int id, CuentaBilleteraRequest req);
    Task<bool> EliminarAsync(int id);
}