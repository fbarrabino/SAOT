using System.ComponentModel.DataAnnotations;
using Billeteras.Negocio.Dtos;

namespace Billeteras.Apps.WebApiApp.Dtos;

/// Cuerpo de POST /api/auth/register.
public record RegisterRequest(
    [property: Required, MaxLength(100)] string Nombre,
    [property: Required, MaxLength(100)] string Apellido,
    [property: Required, EmailAddress, MaxLength(200)] string Email,
    [property: Required, MinLength(6), MaxLength(100)] string Password);

/// Cuerpo de POST /api/auth/login.
public record LoginRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required] string Password);

public record LoginResponse(string Token, DateTime ExpiresAt, UsuarioResponse Usuario);