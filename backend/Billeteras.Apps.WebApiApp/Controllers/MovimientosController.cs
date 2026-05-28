
using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[ApiController]
[Route("api/movimientos")]
public class MovimientosController(IMovimientoNegocio negocio) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<MovimientoResponse>>> ObtenerTodos()
        => Ok(await negocio.ObtenerTodosAsync());

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