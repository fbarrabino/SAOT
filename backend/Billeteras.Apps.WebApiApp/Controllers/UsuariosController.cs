using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

// TODO TP-08: agregar [Authorize] (control de acceso es parte del TP de seguridad).
[ApiController]
[Route("api/usuarios")]
public class UsuariosController(IUsuarioNegocio negocio) : ControllerBase
{
    // El alta de usuario se hace por POST /api/auth/register.

    [HttpGet]
    public async Task<ActionResult<List<UsuarioResponse>>> ObtenerTodos()
        => Ok(await negocio.ObtenerTodosAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UsuarioResponse>> ObtenerPorId(int id)
    {
        var usuario = await negocio.ObtenerPorIdAsync(id);
        return usuario is null ? NotFound() : Ok(usuario);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UsuarioResponse>> Actualizar(int id, [FromBody] UsuarioUpdateRequest req)
    {
        var actualizado = await negocio.ActualizarAsync(id, req);
        return actualizado is null ? NotFound() : Ok(actualizado);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Eliminar(int id)
        => await negocio.EliminarAsync(id) ? NoContent() : NotFound();
}