using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;
using Billeteras.Negocio;
using Billeteras.Negocio.Dtos;
using Moq;
using Xunit;

namespace Billeteras.Tests.TicketSoporte;

/// <summary>
/// Tests unitarios para TicketSoporteNegocio.
/// Se mockea ITicketSoporteRepository para aislar la capa de negocio
/// (no se toca la base de datos).
/// </summary>
public class TicketSoporteNegocioTests
{
    // ── helpers ───────────────────────────────────────────────────────────────

    /// Construye un TicketSoporte con mensajes y adjuntos para simular lo que
    /// devuelve el repositorio tras persistir.
    private static Entidades.TicketSoporte BuildTicketConMensaje(
        int ticketId,
        int usuarioId,
        int motivoId,
        string motivoTitulo,
        string cuerpo,
        List<Entidades.TicketAdjunto> adjuntos)
    {
        var mensaje = new Entidades.TicketMensaje
        {
            MensajeId          = 1,
            TicketId           = ticketId,
            RemitenteEsSoporte = false,
            CuerpoMensaje      = cuerpo,
            FechaEnvio         = DateTime.Now,
            Adjuntos           = adjuntos
        };

        return new Entidades.TicketSoporte
        {
            TicketId      = ticketId,
            UsuarioId     = usuarioId,
            MotivoId      = motivoId,
            FechaCreacion = DateTime.Now,
            Estado        = "Abierto",
            Motivo        = new Entidades.MotivoReporte { MotivoId = motivoId, Titulo = motivoTitulo },
            Mensajes      = [mensaje]
        };
    }

    // ── CrearAsync ────────────────────────────────────────────────────────────

    [Fact]
    public async Task CrearAsync_LlamaCrearConMensajeYAdjuntosAsync_YRetornaDetalle()
    {
        // Arrange
        var mockRepo = new Mock<ITicketSoporteRepository>();

        var req = new CrearTicketRequest(
            MotivoId      : 2,
            CuerpoMensaje : "La app se cierra al pagar",
            Adjuntos      : [new AdjuntoRequest("https://cdn.test/cap.png", "image/png")]
        );

        const int nuevoTicketId = 42;
        const int usuarioId     = 7;

        // Simular que CrearConMensajeYAdjuntosAsync asigna el ID al ticket
        mockRepo
            .Setup(r => r.CrearConMensajeYAdjuntosAsync(
                It.IsAny<Entidades.TicketSoporte>(),
                It.IsAny<Entidades.TicketMensaje>(),
                It.IsAny<List<Entidades.TicketAdjunto>>()))
            .Callback<Entidades.TicketSoporte, Entidades.TicketMensaje, List<Entidades.TicketAdjunto>>(
                (t, m, _) => { t.TicketId = nuevoTicketId; m.MensajeId = 1; })
            .Returns(Task.FromResult(nuevoTicketId));

        // Simular la recarga del ticket recién creado
        var ticketGuardado = BuildTicketConMensaje(
            nuevoTicketId, usuarioId, 2, "Problema de pago",
            req.CuerpoMensaje,
            [new Entidades.TicketAdjunto { AdjuntoId = 1, MensajeId = 1, UrlArchivo = "https://cdn.test/cap.png", TipoMime = "image/png" }]);

        mockRepo
            .Setup(r => r.ObtenerConMensajesAsync(nuevoTicketId))
            .ReturnsAsync(ticketGuardado);

        var negocio = new TicketSoporteNegocio(mockRepo.Object);

        // Act
        var resultado = await negocio.CrearAsync(usuarioId, req);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(nuevoTicketId, resultado.TicketId);
        Assert.Equal(usuarioId,     resultado.UsuarioId);
        Assert.Equal("Abierto",     resultado.Estado);
        Assert.Single(resultado.Mensajes);
        Assert.Equal(req.CuerpoMensaje, resultado.Mensajes[0].CuerpoMensaje);
        Assert.Single(resultado.Mensajes[0].Adjuntos);
        Assert.Equal("image/png", resultado.Mensajes[0].Adjuntos[0].TipoMime);

        // Verificar que el repositorio fue llamado exactamente una vez
        mockRepo.Verify(r => r.CrearConMensajeYAdjuntosAsync(
            It.Is<Entidades.TicketSoporte>(t => t.MotivoId == req.MotivoId && t.UsuarioId == usuarioId),
            It.Is<Entidades.TicketMensaje>(m => m.CuerpoMensaje == req.CuerpoMensaje),
            It.Is<List<Entidades.TicketAdjunto>>(a => a.Count == 1)),
            Times.Once);
    }

    [Fact]
    public async Task CrearAsync_SinAdjuntos_CreaTiketCorrectamente()
    {
        // Arrange
        var mockRepo = new Mock<ITicketSoporteRepository>();

        var req = new CrearTicketRequest(
            MotivoId      : 1,
            CuerpoMensaje : "No puedo iniciar sesión",
            Adjuntos      : []);

        const int ticketId  = 10;
        const int usuarioId = 3;

        mockRepo
            .Setup(r => r.CrearConMensajeYAdjuntosAsync(
                It.IsAny<Entidades.TicketSoporte>(),
                It.IsAny<Entidades.TicketMensaje>(),
                It.IsAny<List<Entidades.TicketAdjunto>>()))
            .Callback<Entidades.TicketSoporte, Entidades.TicketMensaje, List<Entidades.TicketAdjunto>>(
                (t, m, _) => { t.TicketId = ticketId; m.MensajeId = 5; })
            .Returns(Task.FromResult(ticketId));

        mockRepo
            .Setup(r => r.ObtenerConMensajesAsync(ticketId))
            .ReturnsAsync(BuildTicketConMensaje(ticketId, usuarioId, 1, "Acceso", req.CuerpoMensaje, []));

        var negocio = new TicketSoporteNegocio(mockRepo.Object);

        // Act
        var resultado = await negocio.CrearAsync(usuarioId, req);

        // Assert
        Assert.Single(resultado.Mensajes);
        Assert.Empty(resultado.Mensajes[0].Adjuntos);
    }

    // ── ObtenerDetalleAsync ───────────────────────────────────────────────────

    [Fact]
    public async Task ObtenerDetalleAsync_TicketExistente_RetornaDetalle()
    {
        // Arrange
        var mockRepo = new Mock<ITicketSoporteRepository>();
        var ticket   = BuildTicketConMensaje(5, 1, 1, "Motivo A", "Mensaje inicial", []);

        mockRepo.Setup(r => r.ObtenerConMensajesAsync(5)).ReturnsAsync(ticket);

        var negocio = new TicketSoporteNegocio(mockRepo.Object);

        // Act
        var resultado = await negocio.ObtenerDetalleAsync(5);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(5, resultado.TicketId);
        Assert.Equal("Motivo A", resultado.MotivoTitulo);
    }

    [Fact]
    public async Task ObtenerDetalleAsync_TicketInexistente_RetornaNull()
    {
        // Arrange
        var mockRepo = new Mock<ITicketSoporteRepository>();
        mockRepo.Setup(r => r.ObtenerConMensajesAsync(It.IsAny<int>())).ReturnsAsync((Entidades.TicketSoporte?)null);

        var negocio = new TicketSoporteNegocio(mockRepo.Object);

        // Act
        var resultado = await negocio.ObtenerDetalleAsync(999);

        // Assert
        Assert.Null(resultado);
    }

    // ── ObtenerMisAsync ───────────────────────────────────────────────────────

    [Fact]
    public async Task ObtenerMisAsync_UsuarioSinTickets_RetornaListaVacia()
    {
        // Arrange
        var mockRepo = new Mock<ITicketSoporteRepository>();
        mockRepo.Setup(r => r.GetByUsuarioIdAsync(99)).ReturnsAsync([]);

        var negocio = new TicketSoporteNegocio(mockRepo.Object);

        // Act
        var resultado = await negocio.ObtenerMisAsync(99);

        // Assert
        Assert.Empty(resultado);
    }

    [Fact]
    public async Task ObtenerMisAsync_UsuarioConTickets_RetornaResumenCorrecto()
    {
        // Arrange
        var mockRepo = new Mock<ITicketSoporteRepository>();
        const int usuarioId = 1;

        var ticket = BuildTicketConMensaje(3, usuarioId, 2, "Bug crítico", "Falla al transferir", []);

        mockRepo
            .Setup(r => r.GetByUsuarioIdAsync(usuarioId))
            .ReturnsAsync([new Entidades.TicketSoporte { TicketId = 3, UsuarioId = usuarioId, MotivoId = 2, Estado = "Abierto" }]);

        mockRepo
            .Setup(r => r.ObtenerConMensajesAsync(3))
            .ReturnsAsync(ticket);

        var negocio = new TicketSoporteNegocio(mockRepo.Object);

        // Act
        var resultado = await negocio.ObtenerMisAsync(usuarioId);

        // Assert
        Assert.Single(resultado);
        Assert.Equal(3,          resultado[0].TicketId);
        Assert.Equal("Abierto",  resultado[0].Estado);
        Assert.Equal(1,          resultado[0].CantidadMensajes); // 1 mensaje en el ticket
        Assert.Equal("Bug crítico", resultado[0].MotivoTitulo);
    }
}
