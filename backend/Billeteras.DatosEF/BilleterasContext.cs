using Microsoft.EntityFrameworkCore;
using Billeteras.Entidades;

namespace Billeteras.DatosEF;

/// DbContext de EF Core. La DB la crea el script db/init.sql (no usamos Migrations),
/// así que acá solo configuramos lo que EF necesita conocer para leer/escribir bien.
public class BilleterasContext(DbContextOptions<BilleterasContext> options) : DbContext(options)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Billetera> Billeteras => Set<Billetera>();
    public DbSet<CuentaBilletera> CuentasBilletera => Set<CuentaBilletera>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Movimiento> Movimientos => Set<Movimiento>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            // El default GETDATE() lo pone la DB; EF no manda valor en el INSERT.
            e.Property(u => u.FechaAlta)
                .HasDefaultValueSql("GETDATE()")
                .ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<CuentaBilletera>(e =>
        {
            e.Property(c => c.FechaVinculacion)
                .HasDefaultValueSql("GETDATE()")
                .ValueGeneratedOnAdd();
        });
    }
}