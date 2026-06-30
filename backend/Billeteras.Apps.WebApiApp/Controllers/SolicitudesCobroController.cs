using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Apps.WebApiApp.Controllers;

/// Controller para el módulo Maestro-Detalle: Pedido/Cobro.
///
/// Rutas:
///   POST   /api/solicitudes-cobro               → Crear solicitud (cabecera + líneas, transacción)
///   GET    /api/solicitudes-cobro/me             → Mis solicitudes como solicitante
///   GET    /api/solicitudes-cobro/{id}           → Detalle completo (cabecera + líneas)
///   PUT    /api/solicitudes-cobro/lineas/{id}/pagar → Pagar una línea (crea Movimiento, transacción)
[ApiController]
[Route("api/solicitudes-cobro")]
[Authorize]
public class SolicitudesCobroController(ISolicitudCobroNegocio negocio) : ControllerBase
{
    // ── Helper: leer UsuarioId del JWT ────────────────────────────────────────

    private bool TryGetUsuarioId(out int usuarioId)
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out usuarioId);
    }

    // ── GET /api/solicitudes-cobro/me ─────────────────────────────────────────

    /// Devuelve el listado de solicitudes donde el usuario autenticado es el solicitante.
    [HttpGet("me")]
    public async Task<ActionResult<List<SolicitudCobroResumenResponse>>> ObtenerMis()
    {
        if (!TryGetUsuarioId(out var usuarioId))
            return Unauthorized(new { mensaje = "Token inválido o expirado." });

        try
        {
            var lista = await negocio.ObtenerMisAsync(usuarioId);
            return Ok(lista);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"[SolicitudesCobro/me] Error: {ex}");
            return StatusCode(500, new { mensaje = "Error interno al obtener las solicitudes." });
        }
    }

    // ── GET /api/solicitudes-cobro/{id} ───────────────────────────────────────

    /// Devuelve el detalle completo de una solicitud: cabecera + todas sus líneas.
    [HttpGet("{id:int}")]
    public async Task<ActionResult<SolicitudCobroDetalleResponse>> ObtenerDetalle(int id)
    {
        if (!TryGetUsuarioId(out _))
            return Unauthorized(new { mensaje = "Token inválido o expirado." });

        try
        {
            var detalle = await negocio.ObtenerDetalleAsync(id);
            if (detalle is null)
                return NotFound(new { mensaje = $"No existe la solicitud con id {id}." });

            return Ok(detalle);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"[SolicitudesCobro/{id}] Error: {ex}");
            return StatusCode(500, new { mensaje = "Error interno al obtener el detalle." });
        }
    }

    // ── POST /api/solicitudes-cobro ───────────────────────────────────────────

    /// Crea una solicitud de cobro con su cabecera y líneas de detalle.
    /// Toda la operación se ejecuta en una sola transacción de base de datos:
    /// si falla cualquier INSERT (cabecera o alguna línea), se hace ROLLBACK de todo.
    [HttpPost]
    public async Task<ActionResult<SolicitudCobroDetalleResponse>> Crear([FromBody] SolicitudCobroRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (!TryGetUsuarioId(out var usuarioId))
            return Unauthorized(new { mensaje = "Token inválido o expirado." });

        try
        {
            var creada = await negocio.CrearAsync(usuarioId, req);
            // 201 Created con la URL del recurso recién creado
            return CreatedAtAction(nameof(ObtenerDetalle), new { id = creada.SolicitudId }, creada);
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"[SolicitudesCobro/POST] Error: {ex}");
            return StatusCode(500, new { mensaje = "Error interno al crear la solicitud." });
        }
    }

    // ── PUT /api/solicitudes-cobro/lineas/{detalleId}/pagar ───────────────────

    /// El usuario deudor paga una línea de detalle.
    /// Crea un Movimiento de EGRESO en la cuenta indicada y marca la línea como Pagado=true.
    /// Ambas operaciones ocurren en una sola transacción: si falla el INSERT del Movimiento,
    /// la línea NO se marca como pagada (y viceversa).
    [HttpPut("lineas/{detalleId:int}/pagar")]
    public async Task<ActionResult> PagarLinea(
        int detalleId,
        [FromQuery] int cuentaBilleteraId,
        [FromQuery] int categoriaId)
    {
        if (!TryGetUsuarioId(out _))
            return Unauthorized(new { mensaje = "Token inválido o expirado." });

        try
        {
            var movimientoId = await negocio.PagarLineaAsync(detalleId, cuentaBilleteraId, categoriaId);
            return Ok(new
            {
                mensaje = "Línea pagada correctamente.",
                movimientoId
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensaje = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { mensaje = ex.Message });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"[SolicitudesCobro/lineas/{detalleId}/pagar] Error: {ex}");
            return StatusCode(500, new { mensaje = "Error interno al procesar el pago." });
        }
    }
}
