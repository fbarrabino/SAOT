namespace Billeteras.Negocio.Dtos;

public class MetodoPagoExternoDto
{
    public int MetodoId { get; set; }
    public int UsuarioId { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string UltimosCuatro { get; set; } = string.Empty;
    public string EntidadEmisora { get; set; } = string.Empty;
}

public class CreateMetodoPagoExternoDto
{
    public int UsuarioId { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public string UltimosCuatro { get; set; } = string.Empty;
    public string EntidadEmisora { get; set; } = string.Empty;
}