using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Billeteras.Entidades
{
    // ==========================================
    // MÓDULO DE SEGURIDAD Y ROLES
    // ==========================================
    [Table("Rol")]
    public class Rol
    {
        [Key]
        public int RolId { get; set; }
        [Required]
        [MaxLength(50)]
        public string Nombre { get; set; }
        [MaxLength(255)]
        public string Descripcion { get; set; }
    }

    [Table("UsuarioRol")]
    public class UsuarioRol
    {
        [Key, Column(Order = 0)]
        public int UsuarioId { get; set; }
        [Key, Column(Order = 1)]
        public int RolId { get; set; }
    }

    // ==========================================
    // MÓDULO DE RED Y CONTACTOS
    // ==========================================
    [Table("Contacto")]
    public class Contacto
    {
        [Key, Column(Order = 0)]
        public int UsuarioPropietarioId { get; set; }
        [Key, Column(Order = 1)]
        public int UsuarioContactoId { get; set; }
        [MaxLength(50)]
        public string AliasPersonalizado { get; set; }
        public DateTime FechaAgregado { get; set; } = DateTime.Now;
    }

    // ==========================================
    // MÓDULO DE COMERCIOS Y SUCURSALES
    // ==========================================
    [Table("Comercio")]
    public class Comercio
    {
        [Key]
        public int ComercioId { get; set; }
        [Required]
        [MaxLength(100)]
        public string RazonSocial { get; set; }
        [Required]
        [MaxLength(20)]
        public string Cuit { get; set; }
    }

    [Table("Sucursal")]
    public class Sucursal
    {
        [Key]
        public int SucursalId { get; set; }
        public int ComercioId { get; set; }
        [Required]
        [MaxLength(200)]
        public string Direccion { get; set; }
        [Required]
        [MaxLength(255)]
        public string CodigoQRBase { get; set; }
    }

    [Table("ComercioBilletera")]
    public class ComercioBilletera
    {
        [Key, Column(Order = 0)]
        public int ComercioId { get; set; }
        [Key, Column(Order = 1)]
        public int BilleteraId { get; set; }
        public decimal TasaComision { get; set; }
    }

    // ==========================================
    // MÓDULO DE SOLICITUDES DE PAGO/COBRO
    // ==========================================
    [Table("SolicitudCobro")]
    public class SolicitudCobro
    {
        [Key]
        public int SolicitudId { get; set; }
        public int UsuarioSolicitanteId { get; set; }
        public decimal MontoTotal { get; set; }
        public DateTime FechaVencimiento { get; set; }
        [MaxLength(20)]
        public string Estado { get; set; } = "Pendiente";
    }

    [Table("SolicitudCobroDetalle")]
    public class SolicitudCobroDetalle
    {
        [Key]
        public int DetalleSolicitudId { get; set; }
        public int SolicitudId { get; set; }
        public int UsuarioDeudorId { get; set; }
        public decimal MontoMita { get; set; }
        public bool Pagado { get; set; } = false;
    }

    // ==========================================
    // MÓDULO DE SOPORTE TÉCNICO
    // ==========================================
    [Table("TicketSoporte")]
    public class TicketSoporte
    {
        [Key]
        public int TicketId { get; set; }
        public int UsuarioId { get; set; }
        public int MotivoId { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        [MaxLength(20)]
        public string Estado { get; set; } = "Abierto";
    }

    [Table("TicketMensaje")]
    public class TicketMensaje
    {
        [Key]
        public int MensajeId { get; set; }
        public int TicketId { get; set; }
        public bool RemitenteEsSoporte { get; set; } = false;
        [Required]
        public string CuerpoMensaje { get; set; }
        public DateTime FechaEnvio { get; set; } = DateTime.Now;
    }

    // ==========================================
    // MÓDULO DE NOTIFICACIONES Y MÉTODOS
    // ==========================================
    [Table("Notificacion")]
    public class Notificacion
    {
        [Key]
        public int NotificacionId { get; set; }
        public int UsuarioId { get; set; }
        [Required]
        [MaxLength(100)]
        public string Titulo { get; set; }
        [Required]
        [MaxLength(255)]
        public string Mensaje { get; set; }
        public bool Leida { get; set; } = false;
        public DateTime FechaEmision { get; set; } = DateTime.Now;
    }
}