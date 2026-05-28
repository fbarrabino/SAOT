using Billeteras.Negocio.Dtos;

namespace Billeteras.Negocio.Interfaces;

public interface IMovimientoNegocio
{
    Task<List<MovimientoResponse>> ObtenerTodosAsync();
    Task<MovimientoResponse?> ObtenerPorIdAsync(int id);
    Task<MovimientoResponse> CrearAsync(MovimientoRequest req);
    Task<MovimientoResponse?> ActualizarAsync(int id, MovimientoRequest req);
    Task<bool> EliminarAsync(int id);
}