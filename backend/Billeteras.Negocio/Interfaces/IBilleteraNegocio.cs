using Billeteras.Negocio.Dtos;

namespace Billeteras.Negocio.Interfaces;

public interface IBilleteraNegocio
{
    Task<List<BilleteraResponse>> ObtenerTodosAsync();
    Task<BilleteraResponse?> ObtenerPorIdAsync(int id);
    Task<BilleteraResponse> CrearAsync(BilleteraRequest req);
    Task<BilleteraResponse?> ActualizarAsync(int id, BilleteraRequest req);
    Task<bool> EliminarAsync(int id);
}