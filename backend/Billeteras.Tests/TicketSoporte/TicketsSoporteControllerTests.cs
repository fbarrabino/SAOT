using System.Security.Claims;
using Billeteras.Apps.WebApiApp.Controllers;
using Billeteras.Negocio.Dtos;
using Billeteras.Negocio.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Billeteras.Tests.TicketSoporte;

/// <summary>
/// Tests unitarios para TicketsSoporteController.
/// Se mockea ITicketSoporteNegocio para aislar el controller.
/// El JWT se simula con un ClaimsPrincipal en el HttpContext.
/// </summary>
public class TicketsSoporteControllerTests
{
    // ── helpers ───────────────────────────────────────────────────────────────

    private const int UsuarioIdFake = 5;

    /// Crea el controller con un HttpContext que tiene el claim NameIdentifier seteado.
    private static TicketsSoporteController CrearController(ITicketSoporteNegocio negocio)
    {
        var controller = new TicketsSoporteController(negocio);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(
                    [new Claim(ClaimTypes.NameIdentifier, UsuarioIdFake.ToString())],
                    "TestAuth"))
            }
        };
        return controller;
    }

    private static TicketDetalleResponse BuildDetalleResponse(int ticketId) =>
        new(
            TicketId      : ticketId,
            UsuarioId     : UsuarioIdFake,
            MotivoId      : 1,
            MotivoTitulo  : "Test motivo",
            FechaCreacion : DateTime.Now,
            Estado        : "Abierto",
            Mensajes      : []);

    // ── GET /me ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetMios_Exitoso_Retorna200ConLista()
    {
        // Arrange
        var mockNegocio = new Mock<ITicketSoporteNegocio>();
        var lista = new List<TicketResumenResponse>
        {
            new(1, 1, "Motivo A", DateTime.Now, "Abierto", 2),
            new(2, 2, "Motivo B", DateTime.Now, "Cerrado", 5)
        };
        mockNegocio.Setup(n => n.ObtenerMisAsync(UsuarioIdFake)).ReturnsAsync(lista);

        var controller = CrearController(mockNegocio.Object);

        // Act
        var result = await controller.GetMios();

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, ok.StatusCode);

        var body = Assert.IsAssignableFrom<List<TicketResumenResponse>>(ok.Value);
        Assert.Equal(2, body.Count);
    }

    // ── GET /{id} ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetDetalle_TicketExistente_Retorna200()
    {
        // Arrange
        var mockNegocio = new Mock<ITicketSoporteNegocio>();
        mockNegocio.Setup(n => n.ObtenerDetalleAsync(1)).ReturnsAsync(BuildDetalleResponse(1));

        var controller = CrearController(mockNegocio.Object);

        // Act
        var result = await controller.GetDetalle(1);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, ok.StatusCode);

        var body = Assert.IsType<TicketDetalleResponse>(ok.Value);
        Assert.Equal(1, body.TicketId);
    }

    [Fact]
    public async Task GetDetalle_TicketInexistente_Retorna404()
    {
        // Arrange
        var mockNegocio = new Mock<ITicketSoporteNegocio>();
        mockNegocio.Setup(n => n.ObtenerDetalleAsync(999)).ReturnsAsync((TicketDetalleResponse?)null);

        var controller = CrearController(mockNegocio.Object);

        // Act
        var result = await controller.GetDetalle(999);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result);
    }

    // ── POST / ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task Crear_RequestValido_Retorna201ConDetalle()
    {
        // Arrange
        var mockNegocio = new Mock<ITicketSoporteNegocio>();
        var req = new CrearTicketRequest(
            MotivoId      : 1,
            CuerpoMensaje : "No puedo ver mis movimientos",
            Adjuntos      : []);

        const int nuevoId = 99;
        var detalleCreado = BuildDetalleResponse(nuevoId);

        mockNegocio
            .Setup(n => n.CrearAsync(UsuarioIdFake, req))
            .ReturnsAsync(detalleCreado);

        var controller = CrearController(mockNegocio.Object);

        // Act
        var result = await controller.Crear(req);

        // Assert
        var created = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(201, created.StatusCode);
        Assert.Equal(nameof(controller.GetDetalle), created.ActionName);

        var body = Assert.IsType<TicketDetalleResponse>(created.Value);
        Assert.Equal(nuevoId, body.TicketId);
    }

    [Fact]
    public async Task Crear_NegocioLanzaExcepcion_Retorna500()
    {
        // Arrange
        var mockNegocio = new Mock<ITicketSoporteNegocio>();
        var req = new CrearTicketRequest(1, "mensaje", []);

        mockNegocio
            .Setup(n => n.CrearAsync(It.IsAny<int>(), It.IsAny<CrearTicketRequest>()))
            .ThrowsAsync(new InvalidOperationException("Error de BD simulado"));

        var controller = CrearController(mockNegocio.Object);

        // Act
        var result = await controller.Crear(req);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);
    }
}
