using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

/// Endpoints transaccionales del dominio. Cada acción agrupa movimiento(s) +
/// actualización de saldo bajo una misma transacción: si algo falla se revierte
/// todo y se devuelve 409 con el mensaje del negocio.
[ApiController]
[Route("api/operaciones")]
[Authorize]
public class OperacionesController(IOperacionesNegocio negocio) : ControllerBase
{
    [HttpPost("enviar")]
    public async Task<ActionResult<OperacionResponse>> Enviar([FromBody] EnviarRequest req)
        => await EjecutarAsync(() => negocio.EnviarAsync(req));

    [HttpPost("cambiar")]
    public async Task<ActionResult<OperacionResponse>> Cambiar([FromBody] CambiarRequest req)
        => await EjecutarAsync(() => negocio.CambiarAsync(req));

    /// Envoltorio común: las validaciones del negocio se traducen a 409 Conflict
    /// (saldo insuficiente, categoría inválida, cuentas inexistentes) y el resto
    /// queda en 500.
    private async Task<ActionResult<OperacionResponse>> EjecutarAsync(Func<Task<OperacionResponse>> accion)
    {
        try
        {
            var resultado = await accion();
            return Ok(resultado);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { mensaje = ex.Message });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"[Operaciones] Error inesperado: {ex}");
            return StatusCode(500, new { mensaje = "Error interno al procesar la operación." });
        }
    }
}
