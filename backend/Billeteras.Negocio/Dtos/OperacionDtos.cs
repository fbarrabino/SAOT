using System.ComponentModel.DataAnnotations;

namespace Billeteras.Negocio.Dtos;

// ─── Enviar (BE-03) ───────────────────────────────────────────────────────────
// Resta saldo de la cuenta origen y deja un único movimiento de egreso.
public record EnviarRequest(
    [Range(1, int.MaxValue)] int CuentaOrigenId,
    [Range(1, int.MaxValue)] int CategoriaId,
    [Range(0.01, double.MaxValue)] decimal Monto,
    [MaxLength(250)] string? Descripcion);

public record OperacionResponse(
    string Operacion,
    List<int> MovimientosCreados,
    decimal SaldoOrigenFinal,
    decimal? SaldoDestinoFinal);
