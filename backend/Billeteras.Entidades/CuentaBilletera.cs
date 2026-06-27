using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Billeteras.Entidades;

/// La cuenta concreta de un usuario en una billetera virtual.
[Table("CuentaBilletera")]
public class CuentaBilletera
{
    [Key]
    public int CuentaBilleteraId { get; set; }

    [Required]
    public int UsuarioId { get; set; }

    [Required]
    public int BilleteraId { get; set; }

    [MaxLength(100)]
    public string? Alias { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal SaldoActual { get; set; }

    // Default GETDATE() a nivel DB.
    public DateTime FechaVinculacion { get; set; }

    // "Activa" | "Desvinculada"
    [Required, MaxLength(20)]
    public string Estado { get; set; } = "Activa";

    // Propiedades de navegación.
    [ForeignKey(nameof(UsuarioId))]
    public Usuario? Usuario { get; set; }

    [ForeignKey(nameof(BilleteraId))]
    public Billetera? Billetera { get; set; }
}
