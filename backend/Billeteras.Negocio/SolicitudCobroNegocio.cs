using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;

namespace Billeteras.Negocio;

/// Servicio de negocio para el módulo Maestro-Detalle: Pedido/Cobro.
///
/// La regla de oro de la transacción:
///   - Crear una solicitud crea la CABECERA y todas las LÍNEAS en un solo commit.
///   - Pagar una línea crea el MOVIMIENTO y actualiza la línea en un solo commit.
///   Ambas operaciones son delegadas al repositorio, que es quien tiene acceso
///   al DbContext y puede usar BeginTransactionAsync().
public class SolicitudCobroNegocio(ISolicitudCobroRepository repo) : ISolicitudCobroNegocio
{
    // ── Consultas ─────────────────────────────────────────────────────────────

    public async Task<List<SolicitudCobroResumenResponse>> ObtenerMisAsync(int usuarioSolicitanteId)
    {
        var lista = await repo.ObtenerPorSolicitanteAsync(usuarioSolicitanteId);
        return lista.Select(MapResumen).ToList();
    }

    public async Task<SolicitudCobroDetalleResponse?> ObtenerDetalleAsync(int solicitudId)
    {
        var solicitud = await repo.ObtenerConLineasAsync(solicitudId);
        return solicitud is null ? null : MapDetalle(solicitud);
    }

    // ── Comandos ──────────────────────────────────────────────────────────────

    public async Task<SolicitudCobroDetalleResponse> CrearAsync(int usuarioSolicitanteId, SolicitudCobroRequest req)
    {
        // Calculamos MontoTotal sumando las líneas (el frontend no puede confiarse)
        var montoTotal = req.Lineas.Sum(l => l.MontoMita);

        var cabecera = new SolicitudCobro
        {
            UsuarioSolicitanteId = usuarioSolicitanteId,
            Descripcion          = req.Descripcion,
            MontoTotal           = montoTotal,
            FechaVencimiento     = req.FechaVencimiento,
            FechaCreacion        = DateTime.UtcNow,
            Estado               = "Pendiente"
        };

        var lineas = req.Lineas.Select(l => new SolicitudCobroDetalle
        {
            UsuarioDeudorId = l.UsuarioDeudorId,
            MontoMita       = l.MontoMita,
            Concepto        = l.Concepto,
            Pagado          = false
        }).ToList();

        // Una sola transacción: INSERT cabecera + INSERT todas las líneas
        await repo.CrearConLineasAsync(cabecera, lineas);

        // Recargamos con navegaciones para construir la respuesta completa
        var creada = await repo.ObtenerConLineasAsync(cabecera.SolicitudId)
            ?? throw new InvalidOperationException("No se pudo recuperar la solicitud recién creada.");

        return MapDetalle(creada);
    }

    public async Task<int> PagarLineaAsync(int detalleSolicitudId, int cuentaBilleteraDeudorId, int categoriaId)
    {
        var detalle = await repo.ObtenerDetalleAsync(detalleSolicitudId)
            ?? throw new KeyNotFoundException($"No existe la línea de detalle con id {detalleSolicitudId}.");

        if (detalle.Pagado)
            throw new InvalidOperationException("Esta línea ya fue pagada.");

        // Construimos el Movimiento que representa el pago
        var movimiento = new Movimiento
        {
            CuentaBilleteraId = cuentaBilleteraDeudorId,
            CategoriaId       = categoriaId,
            Fecha             = DateTime.UtcNow,
            Descripcion       = $"Pago solicitud #{detalle.SolicitudId}" +
                                (detalle.Concepto is not null ? $" — {detalle.Concepto}" : string.Empty),
            Monto             = detalle.MontoMita,
            Tipo              = "EGRESO"
        };

        // Una sola transacción: INSERT Movimiento + UPDATE línea (Pagado=true, MovimientoId=X)
        return await repo.PagarLineaAsync(detalle, movimiento);
    }

    // ── Mappers privados ──────────────────────────────────────────────────────

    private static SolicitudCobroResumenResponse MapResumen(SolicitudCobro s)
        => new(
            s.SolicitudId,
            s.UsuarioSolicitanteId,
            s.UsuarioSolicitante is not null ? $"{s.UsuarioSolicitante.Nombre} {s.UsuarioSolicitante.Apellido}" : null,
            s.Descripcion,
            s.MontoTotal,
            s.FechaVencimiento,
            s.FechaCreacion,
            s.Estado,
            s.Lineas.Count,
            s.Lineas.Count(l => l.Pagado)
        );

    private static SolicitudCobroDetalleResponse MapDetalle(SolicitudCobro s)
        => new(
            s.SolicitudId,
            s.UsuarioSolicitanteId,
            s.UsuarioSolicitante is not null ? $"{s.UsuarioSolicitante.Nombre} {s.UsuarioSolicitante.Apellido}" : null,
            s.Descripcion,
            s.MontoTotal,
            s.FechaVencimiento,
            s.FechaCreacion,
            s.Estado,
            s.Lineas.Select(MapLinea).ToList()
        );

    private static SolicitudCobroLineaResponse MapLinea(SolicitudCobroDetalle l)
        => new(
            l.DetalleSolicitudId,
            l.SolicitudId,
            l.UsuarioDeudorId,
            l.UsuarioDeudor is not null ? $"{l.UsuarioDeudor.Nombre} {l.UsuarioDeudor.Apellido}" : null,
            l.MontoMita,
            l.Concepto,
            l.Pagado,
            l.MovimientoId
        );
}
