using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Billeteras.Apps.WebApiApp.Dtos;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IUsuarioNegocio usuarios, IConfiguration config) : ControllerBase
{
    /// POST /api/auth/register — público. Crea un usuario (email único + hash BCrypt).
    [HttpPost("register")]
    public async Task<ActionResult<UsuarioResponse>> Register([FromBody] RegisterRequest req)
    {
        var creado = await usuarios.RegistrarAsync(
            new RegistrarUsuarioRequest(req.Nombre, req.Apellido, req.Email, req.Password));

        if (creado is null)
            return BadRequest(new { mensaje = "Ya existe un usuario con ese email." });

        return Ok(creado);
    }

    /// POST /api/auth/login — público. Devuelve un JWT si las credenciales son válidas.
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest req)
    {
        var usuario = await usuarios.AutenticarAsync(req.Email, req.Password);
        if (usuario is null)
            return Unauthorized(new { mensaje = "Email o contraseña inválidos." });

        var (token, expiraEn) = GenerarToken(usuario);
        return Ok(new LoginResponse(token, expiraEn, usuario));
    }

    /// GET /api/auth/me — protegido. Devuelve el usuario del token.
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UsuarioResponse>> Me()
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idClaim, out var usuarioId))
            return Unauthorized();

        var usuario = await usuarios.ObtenerPorIdAsync(usuarioId);
        return usuario is null ? NotFound() : Ok(usuario);
    }

    private (string token, DateTime expiraEn) GenerarToken(UsuarioResponse usuario)
    {
        var jwt = config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var credenciales = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var minutos = int.Parse(jwt["ExpiresInMinutes"] ?? "120");
        var expiraEn = DateTime.UtcNow.AddMinutes(minutos);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.UsuarioId.ToString()),
            new Claim(ClaimTypes.Name, usuario.Email),
            new Claim(ClaimTypes.Role, "User"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: expiraEn,
            signingCredentials: credenciales);

        return (new JwtSecurityTokenHandler().WriteToken(token), expiraEn);
    }
}