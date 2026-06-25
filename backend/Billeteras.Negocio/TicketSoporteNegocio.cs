using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Negocio;

public class TicketSoporteNegocio(ITicketSoporteRepository repo) : ITicketSoporteNegocio
{
    public async Task<List<TicketResumenResponse>> ObtenerMisAsync(int usuarioId)
    {
        var tickets = await repo.GetByUsuarioIdAsync(usuarioId);

        // Para cada ticket cargamos los mensajes y adjuntos para contar
        var resultado = new List<TicketResumenResponse>();
        foreach (var t in tickets)
        {
            var conMensajes = await repo.ObtenerConMensajesAsync(t.TicketId);
            if (conMensajes is null) continue;
            resultado.Add(new TicketResumenResponse(
                conMensajes.TicketId,
                conMensajes.MotivoId,
                conMensajes.Motivo?.Titulo ?? string.Empty,
                conMensajes.FechaCreacion,
                conMensajes.Estado,
                conMensajes.Mensajes.Count));
        }
        return resultado;
    }

    public async Task<TicketDetalleResponse?> ObtenerDetalleAsync(int ticketId)
    {
        var ticket = await repo.ObtenerConMensajesAsync(ticketId);
        return ticket is null ? null : MapearDetalle(ticket);
    }

    public async Task<TicketDetalleResponse> CrearAsync(int usuarioId, CrearTicketRequest req)
    {
        // 1) Construir entidades
        var ticket = new TicketSoporte
        {
            UsuarioId = usuarioId,
            MotivoId  = req.MotivoId,
            Estado    = "Abierto",
            FechaCreacion = DateTime.Now
        };

        var mensaje = new TicketMensaje
        {
            RemitenteEsSoporte = false,
            CuerpoMensaje      = req.CuerpoMensaje,
            FechaEnvio         = DateTime.Now
        };

        var adjuntos = req.Adjuntos
            .Select(a => new TicketAdjunto
            {
                UrlArchivo = a.UrlArchivo,
                TipoMime   = a.TipoMime
            })
            .ToList();

        // 2) Persistir en transacción (cabecera → mensaje → adjuntos)
        await repo.CrearConMensajeYAdjuntosAsync(ticket, mensaje, adjuntos);

        // 3) Recargar con nav props para construir la respuesta
        var creado = await repo.ObtenerConMensajesAsync(ticket.TicketId)
            ?? throw new InvalidOperationException("No se pudo recuperar el ticket recién creado.");

        return MapearDetalle(creado);
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private static TicketDetalleResponse MapearDetalle(TicketSoporte t) =>
        new(
            t.TicketId,
            t.UsuarioId,
            t.MotivoId,
            t.Motivo?.Titulo ?? string.Empty,
            t.FechaCreacion,
            t.Estado,
            t.Mensajes
                .OrderBy(m => m.FechaEnvio)
                .Select(m => new MensajeResponse(
                    m.MensajeId,
                    m.RemitenteEsSoporte,
                    m.CuerpoMensaje,
                    m.FechaEnvio,
                    m.Adjuntos
                        .Select(a => new AdjuntoResponse(a.AdjuntoId, a.UrlArchivo, a.TipoMime))
                        .ToList()))
                .ToList());
}
