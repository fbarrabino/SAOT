using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[ApiController]
[Route("api/cuentas-billetera")]
public class CuentasBilleteraController(ICuentaBilleteraNegocio negocio) : ControllerBase
{
    /// GET /api/cuentas-billetera — admin/debug, sin filtro de usuario.
    [HttpGet]
    public async Task<ActionResult<List<CuentaBilleteraResponse>>> ObtenerTodos()
        => Ok(await negocio.ObtenerTodosAsync());

    /// GET /api/cuentas-billetera/me — protegido.
    /// Devuelve solo las cuentas vinculadas al usuario del JWT.
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<List<CuentaBilleteraResponse>>> ObtenerMias()
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idClaim, out var usuarioId))
            return Unauthorized(new { mensaje = "Token inválido: no se pudo obtener el ID de usuario." });

        try
        {
            var todas = await negocio.ObtenerTodosAsync();
            var mias = todas.Where(c => c.UsuarioId == usuarioId).ToList();
            return Ok(mias);
        }
        catch (Exception ex)
        {
            // Log del error sin exponer detalles internos al cliente
            Console.Error.WriteLine($"[CuentasBilletera/me] Error: {ex}");
            return StatusCode(500, new { mensaje = "Error interno al obtener las cuentas." });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CuentaBilleteraResponse>> ObtenerPorId(int id)
    {
        var cuenta = await negocio.ObtenerPorIdAsync(id);
        return cuenta is null ? NotFound() : Ok(cuenta);
    }

    [HttpPost]
    public async Task<ActionResult<CuentaBilleteraResponse>> Crear([FromBody] CuentaBilleteraRequest req)
    {
        var creada = await negocio.CrearAsync(req);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.CuentaBilleteraId }, creada);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CuentaBilleteraResponse>> Actualizar(int id, [FromBody] CuentaBilleteraRequest req)
    {
        var actualizada = await negocio.ActualizarAsync(id, req);
        return actualizada is null ? NotFound() : Ok(actualizada);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
        => await negocio.EliminarAsync(id) ? NoContent() : NotFound();
}