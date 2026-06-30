using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

[Route("api/tickets-soporte")]
[ApiController]
[Authorize]
public class TicketsSoporteController(ITicketSoporteNegocio negocio) : ControllerBase
{
    // Extrae el UsuarioId del JWT (mismo patrón que SolicitudesCobroController)
    private int UsuarioId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // ── GET /api/tickets-soporte/me ───────────────────────────────────────────
    /// <summary>Devuelve los tickets del usuario autenticado (resumen).</summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetMios()
    {
        var lista = await negocio.ObtenerMisAsync(UsuarioId);
        return Ok(lista);
    }

    // ── GET /api/tickets-soporte/{id} ─────────────────────────────────────────
    /// <summary>Detalle completo: cabecera + mensajes + adjuntos.</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDetalle(int id)
    {
        var detalle = await negocio.ObtenerDetalleAsync(id);
        if (detalle is null)
            return NotFound(new { mensaje = $"No existe el ticket con id {id}." });
        return Ok(detalle);
    }

    // ── POST /api/tickets-soporte ─────────────────────────────────────────────
    /// <summary>
    /// Crea ticket (cabecera) + primer mensaje + adjuntos en una sola transacción.
    /// Devuelve 201 Created con el detalle completo.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearTicketRequest req)
    {
        try
        {
            var creado = await negocio.CrearAsync(UsuarioId, req);
            return CreatedAtAction(nameof(GetDetalle), new { id = creado.TicketId }, creado);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { mensaje = "Error interno al crear el ticket.", detalle = ex.Message });
        }
    }
}
