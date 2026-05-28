using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Billeteras.Entidades;

/// Un movimiento (ingreso o egreso) en una cuenta de billetera.
/// NOTA: registrar un Movimiento NO actualiza el SaldoActual de la CuentaBilletera
/// (esa lógica es TP-06). Acá es un dato simple.
[Table("Movimiento")]
public class Movimiento
{
    [Key]
    public int MovimientoId { get; set; }

    [Required]
    public int CuentaBilleteraId { get; set; }

    [Required]
    public int CategoriaId { get; set; }

    [Required]
    public DateTime Fecha { get; set; }

    [MaxLength(250)]
    public string? Descripcion { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Monto { get; set; }

    [Required]
    [MaxLength(10)]
    public string Tipo { get; set; } = string.Empty;

    // Propiedades de navegación.
    [ForeignKey(nameof(CuentaBilleteraId))]
    public CuentaBilletera? CuentaBilletera { get; set; }

    [ForeignKey(nameof(CategoriaId))]
    public Categoria? Categoria { get; set; }
}
