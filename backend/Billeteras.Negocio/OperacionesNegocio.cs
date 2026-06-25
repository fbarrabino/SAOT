using Billeteras.Datos.Interfaces;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Negocio;

/// Coordina las operaciones transaccionales del dominio. La transacción en sí
/// (BeginTransaction/Commit/Rollback) vive en IOperacionesRepository — acá
/// queda el mapeo al OperacionResponse.
public class OperacionesNegocio(IOperacionesRepository repo) : IOperacionesNegocio
{
    public async Task<OperacionResponse> EnviarAsync(EnviarRequest req)
    {
        var (movId, saldo) = await repo.EnviarAsync(
            req.CuentaOrigenId,
            req.CategoriaId,
            req.Monto,
            req.Descripcion);

        return new OperacionResponse(
            Operacion: "Enviar",
            MovimientosCreados: [movId],
            SaldoOrigenFinal: saldo,
            SaldoDestinoFinal: null);
    }

    public async Task<OperacionResponse> CambiarAsync(CambiarRequest req)
    {
        var (egId, inId, saldoOrigen, saldoDestino) = await repo.CambiarAsync(
            req.CuentaOrigenId,
            req.CuentaDestinoId,
            req.CategoriaEgresoId,
            req.CategoriaIngresoId,
            req.Monto,
            req.Descripcion);

        return new OperacionResponse(
            Operacion: "Cambiar",
            MovimientosCreados: [egId, inId],
            SaldoOrigenFinal: saldoOrigen,
            SaldoDestinoFinal: saldoDestino);
    }

    public async Task<OperacionResponse> PagarQrAsync(PagarQrRequest req)
    {
        var (movId, saldo) = await repo.PagarQrAsync(
            req.CuentaOrigenId,
            req.CategoriaId,
            req.Monto,
            req.Descripcion,
            req.CodigoQR);

        return new OperacionResponse(
            Operacion: "PagarQR",
            MovimientosCreados: [movId],
            SaldoOrigenFinal: saldo,
            SaldoDestinoFinal: null);
    }
}
