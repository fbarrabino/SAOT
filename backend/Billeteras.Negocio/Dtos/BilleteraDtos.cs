using System.ComponentModel.DataAnnotations;

namespace Billeteras.Negocio.Dtos;

public record BilleteraRequest(
    [property: Required, MaxLength(100)] string Nombre,
    [property: MaxLength(300)] string? LogoUrl);

public record BilleteraResponse(
    int BilleteraId,
    string Nombre,
    string? LogoUrl);