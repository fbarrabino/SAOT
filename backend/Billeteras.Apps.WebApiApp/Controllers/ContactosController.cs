using Microsoft.AspNetCore.Mvc;
using Billeteras.Entidades;
using Billeteras.Negocio.Dtos;
using Billeteras.Datos.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[Route("api/contactos")]
[ApiController]
public class ContactosController(IContactoRepository repository) : ControllerBase
{
    [HttpGet("{usuarioPropietarioId}")]
    public async Task<IActionResult> GetContactos(int usuarioPropietarioId)
    {
        var contactos = await repository.GetContactosDeUsuarioAsync(usuarioPropietarioId);
        var dtos = contactos.Select(c => new ContactoDto
        {
            UsuarioPropietarioId = c.UsuarioPropietarioId,
            UsuarioContactoId = c.UsuarioContactoId,
            AliasPersonalizado = c.AliasPersonalizado,
            FechaAgregado = c.FechaAgregado
        });
        return Ok(dtos);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateContactoDto dto)
    {
        var entidad = new Contacto
        {
            UsuarioPropietarioId = dto.UsuarioPropietarioId,
            UsuarioContactoId = dto.UsuarioContactoId,
            AliasPersonalizado = dto.AliasPersonalizado
        };

        var creado = await repository.AddAsync(entidad);
        return Ok(creado);
    }

    [HttpDelete("{usuarioPropietarioId}/{usuarioContactoId}")]
    public async Task<IActionResult> Delete(int usuarioPropietarioId, int usuarioContactoId)
    {
        await repository.DeleteAsync(usuarioPropietarioId, usuarioContactoId);
        return NoContent();
    }
}