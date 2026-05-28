using System.ComponentModel.DataAnnotations;

namespace Billeteras.Negocio.Dtos;

public record CuentaBilleteraRequest(
    [property: Range(1, int.MaxValue)] int UsuarioId,
    [property: Range(1, int.MaxValue)] int BilleteraId,
    [property: MaxLength(100)] string? Alias,
    decimal SaldoActual);

public record CuentaBilleteraResponse(
    int CuentaBilleteraId,
    int UsuarioId,
    int BilleteraId,
    string? Alias,
    decimal SaldoActual,
    DateTime FechaVinculacion,
    string? BilleteraNombre,
    string? UsuarioNombre);