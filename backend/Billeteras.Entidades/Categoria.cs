using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Billeteras.Entidades;

/// Categoría para clasificar movimientos (catálogo). Tipo: "Ingreso" o "Egreso".
[Table("Categoria")]
public class Categoria
{
    [Key]
    public int CategoriaId { get; set; }

    [Required]
    [MaxLength(80)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Tipo { get; set; } = string.Empty;
}
