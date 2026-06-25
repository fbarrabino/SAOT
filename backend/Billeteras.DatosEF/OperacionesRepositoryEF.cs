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
    private const string TipoIngreso = "Ingreso";
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

    // ─── BE-04 Cambiar ────────────────────────────────────────────────────────
    public async Task<(int movEgresoId, int movIngresoId, decimal saldoOrigenFinal, decimal saldoDestinoFinal)>
        CambiarAsync(
            int cuentaOrigenId,
            int cuentaDestinoId,
            int categoriaEgresoId,
            int categoriaIngresoId,
            decimal monto,
            string? descripcion)
    {
        if (cuentaOrigenId == cuentaDestinoId)
            throw new InvalidOperationException("La cuenta origen y destino no pueden ser la misma.");

        await using IDbContextTransaction tx = await ctx.Database.BeginTransactionAsync();
        try
        {
            var origen = await ObtenerCuentaParaEgresoAsync(cuentaOrigenId, monto);
            var destino = await ctx.CuentasBilletera.FirstOrDefaultAsync(c => c.CuentaBilleteraId == cuentaDestinoId)
                ?? throw new InvalidOperationException($"La cuenta destino {cuentaDestinoId} no existe.");

            if (origen.UsuarioId != destino.UsuarioId)
                throw new InvalidOperationException("Las cuentas origen y destino deben pertenecer al mismo usuario.");

            await ValidarCategoriaAsync(categoriaEgresoId, TipoEgreso);
            await ValidarCategoriaAsync(categoriaIngresoId, TipoIngreso);

            var fecha = DateTime.Now;

            var movEgreso = new Movimiento
            {
                CuentaBilleteraId = origen.CuentaBilleteraId,
                CategoriaId = categoriaEgresoId,
                Fecha = fecha,
                Descripcion = descripcion,
                Monto = monto,
                Tipo = TipoEgreso
            };
            var movIngreso = new Movimiento
            {
                CuentaBilleteraId = destino.CuentaBilleteraId,
                CategoriaId = categoriaIngresoId,
                Fecha = fecha,
                Descripcion = descripcion,
                Monto = monto,
                Tipo = TipoIngreso
            };
            ctx.Movimientos.Add(movEgreso);
            ctx.Movimientos.Add(movIngreso);

            origen.SaldoActual -= monto;
            destino.SaldoActual += monto;

            await ctx.SaveChangesAsync();
            await tx.CommitAsync();

            return (movEgreso.MovimientoId, movIngreso.MovimientoId, origen.SaldoActual, destino.SaldoActual);
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    // ─── BE-05 Pagar QR ───────────────────────────────────────────────────────
    public async Task<(int movimientoId, decimal saldoOrigenFinal)> PagarQrAsync(
        int cuentaOrigenId,
        int categoriaId,
        decimal monto,
        string? descripcion,
        string? codigoQR)
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
                Tipo = TipoEgreso,
                // Guardamos el QR escaneado en el campo JSON ya existente del modelo (BE-01)
                // para que quede trazable la operación que originó el pago.
                MetadataExtranjera = codigoQR is null
                    ? null
                    : System.Text.Json.JsonSerializer.Serialize(new { qr = codigoQR })
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
