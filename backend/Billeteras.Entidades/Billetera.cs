using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Billeteras.Entidades;

/// Catálogo de billeteras virtuales soportadas (Mercado Pago, Ualá, etc.).
[Table("Billetera")]
public class Billetera
{
    [Key]
    public int BilleteraId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Nombre { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? LogoUrl { get; set; }
}
