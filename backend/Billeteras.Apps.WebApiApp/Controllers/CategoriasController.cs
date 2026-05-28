
using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[ApiController]
[Route("api/categorias")]
public class CategoriasController(ICategoriaNegocio negocio) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CategoriaResponse>>> ObtenerTodos()
        => Ok(await negocio.ObtenerTodosAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoriaResponse>> ObtenerPorId(int id)
    {
        var categoria = await negocio.ObtenerPorIdAsync(id);
        return categoria is null ? NotFound() : Ok(categoria);
    }

    [HttpPost]
    public async Task<ActionResult<CategoriaResponse>> Crear([FromBody] CategoriaRequest req)
    {
        var creada = await negocio.CrearAsync(req);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = creada.CategoriaId }, creada);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CategoriaResponse>> Actualizar(int id, [FromBody] CategoriaRequest req)
    {
        var actualizada = await negocio.ActualizarAsync(id, req);
        return actualizada is null ? NotFound() : Ok(actualizada);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
        => await negocio.EliminarAsync(id) ? NoContent() : NotFound();
}