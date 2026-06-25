using System.ComponentModel.DataAnnotations;

namespace Billeteras.Negocio.Dtos;

// ─── Enviar (BE-03) ───────────────────────────────────────────────────────────
// Resta saldo de la cuenta origen y deja un único movimiento de egreso.
public record EnviarRequest(
    [Range(1, int.MaxValue)] int CuentaOrigenId,
    [Range(1, int.MaxValue)] int CategoriaId,
    [Range(0.01, double.MaxValue)] decimal Monto,
    [MaxLength(250)] string? Descripcion);

// ─── Cambiar (BE-04) ──────────────────────────────────────────────────────────
// Resta de origen y suma a destino del mismo usuario; dos movimientos atómicos.
public record CambiarRequest(
    [Range(1, int.MaxValue)] int CuentaOrigenId,
    [Range(1, int.MaxValue)] int CuentaDestinoId,
    [Range(1, int.MaxValue)] int CategoriaEgresoId,
    [Range(1, int.MaxValue)] int CategoriaIngresoId,
    [Range(0.01, double.MaxValue)] decimal Monto,
    [MaxLength(250)] string? Descripcion);

public record OperacionResponse(
    string Operacion,
    List<int> MovimientosCreados,
    decimal SaldoOrigenFinal,
    decimal? SaldoDestinoFinal);
