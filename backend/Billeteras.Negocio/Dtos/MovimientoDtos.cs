using System.ComponentModel.DataAnnotations;

namespace Billeteras.Negocio.Dtos;

public record MovimientoRequest(
    [Range(1, int.MaxValue)] int CuentaBilleteraId,
    [Range(1, int.MaxValue)] int CategoriaId,
    DateTime Fecha,
    [MaxLength(250)] string? Descripcion,
    decimal Monto,
    [Required, MaxLength(10)] string Tipo);

public record MovimientoResponse(
    int MovimientoId,
    int CuentaBilleteraId,
    int CategoriaId,
    DateTime Fecha,
    string? Descripcion,
    decimal Monto,
    string Tipo,
    string? CategoriaNombre,
    string? CuentaAlias);
