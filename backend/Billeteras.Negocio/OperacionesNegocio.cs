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
}
