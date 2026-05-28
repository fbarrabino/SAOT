using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Negocio;

/// Servicio de Negocio de Movimiento.
/// NOTA: crear/editar un movimiento NO modifica el SaldoActual de la cuenta (eso es TP-06).
public class MovimientoNegocio(IMovimientoRepository repo) : IMovimientoNegocio
{
    public async Task<List<MovimientoResponse>> ObtenerTodosAsync()
        => (await repo.ObtenerTodosAsync()).Select(Map).ToList();

    public async Task<MovimientoResponse?> ObtenerPorIdAsync(int id)
    {
        var movimiento = await repo.ObtenerPorIdAsync(id);
        return movimiento is null ? null : Map(movimiento);
    }

    public async Task<MovimientoResponse> CrearAsync(MovimientoRequest req)
    {
        var movimiento = new Movimiento
        {
            CuentaBilleteraId = req.CuentaBilleteraId,
            CategoriaId = req.CategoriaId,
            Fecha = req.Fecha,
            Descripcion = req.Descripcion,
            Monto = req.Monto,
            Tipo = req.Tipo
        };
        movimiento.MovimientoId = await repo.InsertarAsync(movimiento);
        return Map(movimiento);
    }

    public async Task<MovimientoResponse?> ActualizarAsync(int id, MovimientoRequest req)
    {
        var movimiento = await repo.ObtenerPorIdAsync(id);
        if (movimiento is null)
            return null;

        movimiento.CuentaBilleteraId = req.CuentaBilleteraId;
        movimiento.CategoriaId = req.CategoriaId;
        movimiento.Fecha = req.Fecha;
        movimiento.Descripcion = req.Descripcion;
        movimiento.Monto = req.Monto;
        movimiento.Tipo = req.Tipo;

        await repo.ActualizarAsync(movimiento);
        return Map(movimiento);
    }

    public Task<bool> EliminarAsync(int id) => repo.EliminarAsync(id);

    private static MovimientoResponse Map(Movimiento m)
        => new(
            m.MovimientoId,
            m.CuentaBilleteraId,
            m.CategoriaId,
            m.Fecha,
            m.Descripcion,
            m.Monto,
            m.Tipo,
            m.Categoria?.Nombre,
            m.CuentaBilletera?.Alias);
}