namespace Billeteras.Negocio.Dtos;

public class TicketSoporteDto
{
    public int TicketId { get; set; }
    public int UsuarioId { get; set; }
    public int MotivoId { get; set; }
    public DateTime FechaCreacion { get; set; }
    public string Estado { get; set; } = string.Empty;
}

public class CreateTicketSoporteDto
{
    public int UsuarioId { get; set; }
    public int MotivoId { get; set; }
}