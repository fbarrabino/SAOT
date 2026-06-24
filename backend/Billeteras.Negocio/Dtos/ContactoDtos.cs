namespace Billeteras.Negocio.Dtos;

public class ContactoDto
{
    public int UsuarioPropietarioId { get; set; }
    public int UsuarioContactoId { get; set; }
    public string? AliasPersonalizado { get; set; }
    public DateTime FechaAgregado { get; set; }
}

public class CreateContactoDto
{
    public int UsuarioPropietarioId { get; set; }
    public int UsuarioContactoId { get; set; }
    public string? AliasPersonalizado { get; set; }
}