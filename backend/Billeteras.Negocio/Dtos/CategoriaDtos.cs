using System.ComponentModel.DataAnnotations;

namespace Billeteras.Negocio.Dtos;

public record CategoriaRequest(
    [property: Required, MaxLength(80)] string Nombre,
    [property: Required, MaxLength(20)] string Tipo);

public record CategoriaResponse(
    int CategoriaId,
    string Nombre,
    string Tipo);