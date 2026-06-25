using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;

namespace Billeteras.DatosEF;

/// Implementación EF Core de las operaciones transaccionales del dominio.
///
/// Patrón común:
///   1. ctx.Database.BeginTransactionAsync()
///   2. validar cuentas + categorías + saldo
///   3. agregar movimiento(s) y actualizar saldo(s)
///   4. SaveChangesAsync()
///   5. CommitAsync() — o RollbackAsync() vía try/catch ante cualquier excepción
public class OperacionesRepositoryEF(BilleterasContext ctx) : IOperacionesRepository
{
    private const string TipoEgreso = "Egreso";

    // ─── BE-03 Enviar ─────────────────────────────────────────────────────────
    public async Task<(int movimientoId, decimal saldoOrigenFinal)> EnviarAsync(
        int cuentaOrigenId,
        int categoriaId,
        decimal monto,
        string? descripcion)
    {
        await using IDbContextTransaction tx = await ctx.Database.BeginTransactionAsync();
        try
        {
            var cuenta = await ObtenerCuentaParaEgresoAsync(cuentaOrigenId, monto);
            await ValidarCategoriaAsync(categoriaId, TipoEgreso);

            var movimiento = new Movimiento
            {
                CuentaBilleteraId = cuenta.CuentaBilleteraId,
                CategoriaId = categoriaId,
                Fecha = DateTime.Now,
                Descripcion = descripcion,
                Monto = monto,
                Tipo = TipoEgreso
            };
            ctx.Movimientos.Add(movimiento);

            cuenta.SaldoActual -= monto;

            await ctx.SaveChangesAsync();
            await tx.CommitAsync();

            return (movimiento.MovimientoId, cuenta.SaldoActual);
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private async Task<CuentaBilletera> ObtenerCuentaParaEgresoAsync(int cuentaId, decimal monto)
    {
        var cuenta = await ctx.CuentasBilletera.FirstOrDefaultAsync(c => c.CuentaBilleteraId == cuentaId)
            ?? throw new InvalidOperationException($"La cuenta {cuentaId} no existe.");

        if (cuenta.SaldoActual < monto)
            throw new InvalidOperationException(
                $"Saldo insuficiente en la cuenta {cuentaId}. Disponible: {cuenta.SaldoActual}, requerido: {monto}.");

        return cuenta;
    }

    private async Task ValidarCategoriaAsync(int categoriaId, string tipoEsperado)
    {
        var categoria = await ctx.Categorias.FirstOrDefaultAsync(c => c.CategoriaId == categoriaId)
            ?? throw new InvalidOperationException($"La categoría {categoriaId} no existe.");

        if (!string.Equals(categoria.Tipo, tipoEsperado, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException(
                $"La categoría '{categoria.Nombre}' es de tipo '{categoria.Tipo}', se esperaba '{tipoEsperado}'.");
    }
}
