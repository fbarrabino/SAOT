using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[ApiController]
[Route("api/movimientos")]
public class MovimientosController(
    IMovimientoNegocio negocio,
    ICuentaBilleteraNegocio cuentas) : ControllerBase
{
    /// GET /api/movimientos — admin/debug, sin filtro de usuario.
    [HttpGet]
    public async Task<ActionResult<List<MovimientoResponse>>> ObtenerTodos()
        => Ok(await negocio.ObtenerTodosAsync());

    /// GET /api/movimientos/me — protegido.
    /// Devuelve los movimientos de las cuentas del usuario autenticado,
    /// ordenados por fecha descendente.
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<List<MovimientoResponse>>> ObtenerMios()
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idClaim, out var usuarioId))
            return Unauthorized(new { mensaje = "Token inválido: no se pudo obtener el ID de usuario." });

        try
        {
            // 1. Obtenemos las cuentas del usuario para saber qué CuentaBilleteraIds le pertenecen
            var todasLasCuentas = await cuentas.ObtenerTodosAsync();
            var cuentaIdsDelUsuario = todasLasCuentas
                .Where(c => c.UsuarioId == usuarioId)
                .Select(c => c.CuentaBilleteraId)
                .ToHashSet();

            if (cuentaIdsDelUsuario.Count == 0)
                return Ok(new List<MovimientoResponse>());

            // 2. Filtramos los movimientos que pertenezcan a esas cuentas
            var todos = await negocio.ObtenerTodosAsync();
            var mios = todos
                .Where(m => cuentaIdsDelUsuario.Contains(m.CuentaBilleteraId))
                .OrderByDescending(m => m.Fecha)
                .ToList();

            return Ok(mios);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"[Movimientos/me] Error: {ex}");
            return StatusCode(500, new { mensaje = "Error interno al obtener los movimientos." });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MovimientoResponse>> ObtenerPorId(int id)
    {
        var movimiento = await negocio.ObtenerPorIdAsync(id);
        return movimiento is null ? NotFound() : Ok(movimiento);
    }

    [HttpPost]
    public async Task<ActionResult<MovimientoResponse>> Crear([FromBody] MovimientoRequest req)
    {
        var creado = await negocio.CrearAsync(req);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.MovimientoId }, creado);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<MovimientoResponse>> Actualizar(int id, [FromBody] MovimientoRequest req)
    {
        var actualizado = await negocio.ActualizarAsync(id, req);
        return actualizado is null ? NotFound() : Ok(actualizado);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
        => await negocio.EliminarAsync(id) ? NoContent() : NotFound();
}