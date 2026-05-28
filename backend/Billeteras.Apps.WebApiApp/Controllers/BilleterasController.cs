using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[ApiController]
[Route("api/billeteras")]
public class BilleterasController(IBilleteraNegocio negocio) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<BilleteraResponse>>> ObtenerTodos()
        => Ok(await negocio.ObtenerTodosAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BilleteraResponse>> ObtenerPorId(int id)
    {
        var billetera = await negocio.ObtenerPorIdAsync(id);
        return billetera is null ? NotFound() : Ok(billetera);
    }

    [HttpPost]
    public async Task<ActionResult<BilleteraResponse>> Crear([FromBody] BilleteraRequest req)
    {
        var creada = await negocio.CrearAsync(req);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.BilleteraId }, creada);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<BilleteraResponse>> Actualizar(int id, [FromBody] BilleteraRequest req)
    {
        var actualizada = await negocio.ActualizarAsync(id, req);
        return actualizada is null ? NotFound() : Ok(actualizada);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
        => await negocio.EliminarAsync(id) ? NoContent() : NotFound();
}