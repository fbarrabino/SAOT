using System.ComponentModel.DataAnnotations;

namespace Billeteras.Negocio.Dtos;

public record CuentaBilleteraRequest(
    [Range(1, int.MaxValue)] int UsuarioId,
    [Range(1, int.MaxValue)] int BilleteraId,
    [MaxLength(100)] string? Alias,
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
