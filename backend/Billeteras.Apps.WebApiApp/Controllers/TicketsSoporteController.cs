using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Billeteras.Entidades;
using Billeteras.Negocio.Dtos;
using Billeteras.Datos.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[Route("api/tickets-soporte")]
[ApiController]
[Authorize]
public class TicketsSoporteController(ITicketSoporteRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tickets = await repository.GetAllAsync();
        return Ok(tickets);
    }

    [HttpGet("usuario/{usuarioId}")]
    public async Task<IActionResult> GetByUsuario(int usuarioId)
    {
        var tickets = await repository.GetByUsuarioIdAsync(usuarioId);
        return Ok(tickets);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTicketSoporteDto dto)
    {
        var entidad = new TicketSoporte
        {
            UsuarioId = dto.UsuarioId,
            MotivoId = dto.MotivoId
        };

        var creado = await repository.AddAsync(entidad);
        return Ok(creado);
    }

    [HttpPatch("{id}/estado")]
    public async Task<IActionResult> UpdateEstado(int id, [FromBody] string nuevoEstado)
    {
        await repository.UpdateEstadoAsync(id, nuevoEstado);
        return NoContent();
    }
}