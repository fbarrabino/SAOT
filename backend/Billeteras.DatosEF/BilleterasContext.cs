using Microsoft.EntityFrameworkCore;
using Billeteras.Entidades;

namespace Billeteras.DatosEF;

/// DbContext de EF Core. La DB la crea el script db/init.sql (no usamos Migrations),
/// así que acá solo configuramos lo que EF necesita conocer para leer/escribir bien.
public class BilleterasContext(DbContextOptions<BilleterasContext> options) : DbContext(options)
{
    // Entidades Base (TP-04)
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Billetera> Billeteras => Set<Billetera>();
    public DbSet<CuentaBilletera> CuentasBilletera => Set<CuentaBilletera>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Movimiento> Movimientos => Set<Movimiento>();

    // ==========================================
    // ENTIDADES EXTENDIDAS (BE-01)
    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<UsuarioRol> UsuariosRoles => Set<UsuarioRol>();
    public DbSet<Contacto> Contactos => Set<Contacto>();
    public DbSet<Comercio> Comercios => Set<Comercio>();
    public DbSet<Sucursal> Sucursales => Set<Sucursal>();
    public DbSet<ComercioBilletera> ComerciosBilleteras => Set<ComercioBilletera>();
    public DbSet<SolicitudCobro> SolicitudesCobro => Set<SolicitudCobro>();
    public DbSet<SolicitudCobroDetalle> SolicitudesCobroDetalles => Set<SolicitudCobroDetalle>();
    public DbSet<MotivoReporte> MotivosReporte => Set<MotivoReporte>();
    public DbSet<TicketSoporte> TicketsSoporte => Set<TicketSoporte>();
    public DbSet<TicketMensaje> TicketsMensajes => Set<TicketMensaje>();
    public DbSet<TicketAdjunto> TicketsAdjuntos => Set<TicketAdjunto>();
    public DbSet<Notificacion> Notificaciones => Set<Notificacion>();
    public DbSet<MetodoPagoExterno> MetodosPagoExternos => Set<MetodoPagoExterno>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuración Base
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

        // ==========================================
        // CONFIGURACIÓN DE CLAVES COMPUESTAS (BE-01)
        // EF Core requiere configurar las PK compuestas (relaciones N-N) por Fluent API
        modelBuilder.Entity<UsuarioRol>()
            .HasKey(ur => new { ur.UsuarioId, ur.RolId });

        modelBuilder.Entity<Contacto>()
            .HasKey(c => new { c.UsuarioPropietarioId, c.UsuarioContactoId });

        modelBuilder.Entity<ComercioBilletera>()
            .HasKey(cb => new { cb.ComercioId, cb.BilleteraId });
    }
}