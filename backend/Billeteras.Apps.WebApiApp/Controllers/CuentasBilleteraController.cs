using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[ApiController]
[Route("api/cuentas-billetera")]
public class CuentasBilleteraController(ICuentaBilleteraNegocio negocio) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CuentaBilleteraResponse>>> ObtenerTodos()
        => Ok(await negocio.ObtenerTodosAsync());

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