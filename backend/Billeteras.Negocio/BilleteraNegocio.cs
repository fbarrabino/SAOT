using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Negocio;

public class BilleteraNegocio(IBilleteraRepository repo) : IBilleteraNegocio
{
    public async Task<List<BilleteraResponse>> ObtenerTodosAsync()
        => (await repo.ObtenerTodosAsync()).Select(Map).ToList();

    public async Task<BilleteraResponse?> ObtenerPorIdAsync(int id)
    {
        var billetera = await repo.ObtenerPorIdAsync(id);
        return billetera is null ? null : Map(billetera);
    }

    public async Task<BilleteraResponse> CrearAsync(BilleteraRequest req)
    {
        var billetera = new Billetera { Nombre = req.Nombre, LogoUrl = req.LogoUrl };
        billetera.BilleteraId = await repo.InsertarAsync(billetera);
        return Map(billetera);
    }

    public async Task<BilleteraResponse?> ActualizarAsync(int id, BilleteraRequest req)
    {
        var billetera = await repo.ObtenerPorIdAsync(id);
        if (billetera is null)
            return null;

        billetera.Nombre = req.Nombre;
        billetera.LogoUrl = req.LogoUrl;

        await repo.ActualizarAsync(billetera);
        return Map(billetera);
    }

    public Task<bool> EliminarAsync(int id) => repo.EliminarAsync(id);

    private static BilleteraResponse Map(Billetera b)
        => new(b.BilleteraId, b.Nombre, b.LogoUrl);
}