/* ============================================================================
   Billeteras — Script de inicialización de la base de datos
   Unificador de Billeteras Virtuales · Equipo SAOT · Programación III · UTN FRRe
   ----------------------------------------------------------------------------
   Crea la base BilleterasDB, las 5 tablas del dominio y los seeds de catálogo.
   El script es idempotente: se puede correr varias veces sin romper nada.
   No crea usuario de prueba: el usuario se da de alta vía POST /api/auth/register.
   ============================================================================ */

-- 1) Crear la base si no existe -------------------------------------------------
IF DB_ID(N'BilleterasDB') IS NULL
    CREATE DATABASE BilleterasDB;
GO

USE BilleterasDB;
GO

-- 2) Tablas ---------------------------------------------------------------------

IF OBJECT_ID(N'dbo.Usuario', N'U') IS NULL
CREATE TABLE dbo.Usuario
(
    UsuarioId    INT IDENTITY(1,1) NOT NULL,
    Nombre       NVARCHAR(100)     NOT NULL,
    Apellido     NVARCHAR(100)     NOT NULL,
    Email        NVARCHAR(200)     NOT NULL,
    PasswordHash NVARCHAR(200)     NOT NULL,
    FechaAlta    DATETIME          NOT NULL CONSTRAINT DF_Usuario_FechaAlta DEFAULT (GETDATE()),
    CONSTRAINT PK_Usuario PRIMARY KEY (UsuarioId),
    CONSTRAINT UQ_Usuario_Email UNIQUE (Email)
);
GO

IF OBJECT_ID(N'dbo.Billetera', N'U') IS NULL
CREATE TABLE dbo.Billetera
(
    BilleteraId INT IDENTITY(1,1) NOT NULL,
    Nombre      NVARCHAR(100)     NOT NULL,
    LogoUrl     NVARCHAR(300)     NULL,
    CONSTRAINT PK_Billetera PRIMARY KEY (BilleteraId)
);
GO

IF OBJECT_ID(N'dbo.Categoria', N'U') IS NULL
CREATE TABLE dbo.Categoria
(
    CategoriaId INT IDENTITY(1,1) NOT NULL,
    Nombre      NVARCHAR(80)      NOT NULL,
    Tipo        NVARCHAR(20)      NOT NULL,   -- "Ingreso" | "Egreso"
    CONSTRAINT PK_Categoria PRIMARY KEY (CategoriaId)
);
GO

IF OBJECT_ID(N'dbo.CuentaBilletera', N'U') IS NULL
CREATE TABLE dbo.CuentaBilletera
(
    CuentaBilleteraId INT IDENTITY(1,1) NOT NULL,
    UsuarioId         INT               NOT NULL,
    BilleteraId       INT               NOT NULL,
    Alias             NVARCHAR(100)     NULL,
    SaldoActual       DECIMAL(18,2)     NOT NULL CONSTRAINT DF_CuentaBilletera_SaldoActual DEFAULT (0),
    FechaVinculacion  DATETIME          NOT NULL CONSTRAINT DF_CuentaBilletera_FechaVinculacion DEFAULT (GETDATE()),
    CONSTRAINT PK_CuentaBilletera PRIMARY KEY (CuentaBilleteraId),
    CONSTRAINT FK_CuentaBilletera_Usuario   FOREIGN KEY (UsuarioId)   REFERENCES dbo.Usuario (UsuarioId)     ON DELETE NO ACTION,
    CONSTRAINT FK_CuentaBilletera_Billetera FOREIGN KEY (BilleteraId) REFERENCES dbo.Billetera (BilleteraId) ON DELETE NO ACTION
);
GO

IF OBJECT_ID(N'dbo.Movimiento', N'U') IS NULL
CREATE TABLE dbo.Movimiento
(
    MovimientoId      INT IDENTITY(1,1) NOT NULL,
    CuentaBilleteraId INT               NOT NULL,
    CategoriaId       INT               NOT NULL,
    Fecha             DATETIME          NOT NULL,
    Descripcion       NVARCHAR(250)     NULL,
    Monto             DECIMAL(18,2)     NOT NULL,
    Tipo              NVARCHAR(10)      NOT NULL,   -- "Ingreso" | "Egreso"
    CONSTRAINT PK_Movimiento PRIMARY KEY (MovimientoId),
    CONSTRAINT FK_Movimiento_CuentaBilletera FOREIGN KEY (CuentaBilleteraId) REFERENCES dbo.CuentaBilletera (CuentaBilleteraId) ON DELETE NO ACTION,
    CONSTRAINT FK_Movimiento_Categoria       FOREIGN KEY (CategoriaId)       REFERENCES dbo.Categoria (CategoriaId)             ON DELETE NO ACTION
);
GO

-- 3) Seeds de catálogo ----------------------------------------------------------

-- Billeteras del mercado argentino
IF NOT EXISTS (SELECT 1 FROM dbo.Billetera)
INSERT INTO dbo.Billetera (Nombre) VALUES
    (N'Mercado Pago'),
    (N'Ualá'),
    (N'Brubank'),
    (N'Naranja X'),
    (N'Personal Pay');
GO

-- Categorías de movimientos
IF NOT EXISTS (SELECT 1 FROM dbo.Categoria)
INSERT INTO dbo.Categoria (Nombre, Tipo) VALUES
    (N'Sueldo',                 N'Ingreso'),
    (N'Transferencia recibida', N'Ingreso'),
    (N'Alimentos',              N'Egreso'),
    (N'Transporte',             N'Egreso'),
    (N'Servicios',              N'Egreso'),
    (N'Ocio',                   N'Egreso'),
    (N'Otros',                  N'Egreso');
GO

-- ===================================================================
-- EXTENSIÓN DEL MODELO DE DATOS (BE-01) - TFI UTN FRRe
-- Desarrollado por: Franco Barrabino
-- Objetivo: Alcanzar las 20 tablas, relaciones N-N y campo JSON.
-- ===================================================================

-- 1. MÓDULO DE SEGURIDAD (Requisito para BE-11)
CREATE TABLE [dbo].[Rol] (
    [RolId] INT IDENTITY(1,1) PRIMARY KEY,
    [Nombre] VARCHAR(50) NOT NULL UNIQUE,
    [Descripcion] VARCHAR(255) NULL
);

CREATE TABLE [dbo].[UsuarioRol] (
    [UsuarioId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Usuario]([UsuarioId]),
    [RolId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Rol]([RolId]),
    PRIMARY KEY ([UsuarioId], [RolId])
);

-- 2. MÓDULO DE RED Y CONTACTOS (Requisito para BE-03)
CREATE TABLE [dbo].[Contacto] (
    [UsuarioPropietarioId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Usuario]([UsuarioId]),
    [UsuarioContactoId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Usuario]([UsuarioId]),
    [AliasPersonalizado] VARCHAR(50) NULL,
    [FechaAgregado] DATETIME DEFAULT GETDATE(),
    PRIMARY KEY ([UsuarioPropietarioId], [UsuarioContactoId])
);

-- 3. MÓDULO DE COMERCIOS Y PAGOS QR (Requisito para BE-05)
CREATE TABLE [dbo].[Comercio] (
    [ComercioId] INT IDENTITY(1,1) PRIMARY KEY,
    [RazonSocial] VARCHAR(100) NOT NULL,
    [Cuit] VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE [dbo].[Sucursal] (
    [SucursalId] INT IDENTITY(1,1) PRIMARY KEY,
    [ComercioId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Comercio]([ComercioId]),
    [Direccion] VARCHAR(200) NOT NULL,
    [CodigoQRBase] VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE [dbo].[ComercioBilletera] (
    [ComercioId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Comercio]([ComercioId]),
    [BilleteraId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Billetera]([BilleteraId]),
    [TasaComision] DECIMAL(5,2) DEFAULT 0,
    PRIMARY KEY ([ComercioId], [BilleteraId])
);

-- 4. MÓDULO DE SOLICITUDES DE PAGO/COBRO (Requisito para BE-06)
CREATE TABLE [dbo].[SolicitudCobro] (
    [SolicitudId] INT IDENTITY(1,1) PRIMARY KEY,
    [UsuarioSolicitanteId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Usuario]([UsuarioId]),
    [MontoTotal] DECIMAL(18,2) NOT NULL,
    [FechaVencimiento] DATETIME NOT NULL,
    [Estado] VARCHAR(20) DEFAULT 'Pendiente'
);

CREATE TABLE [dbo].[SolicitudCobroDetalle] (
    [DetalleSolicitudId] INT IDENTITY(1,1) PRIMARY KEY,
    [SolicitudId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[SolicitudCobro]([SolicitudId]),
    [UsuarioDeudorId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Usuario]([UsuarioId]),
    [MontoMita] DECIMAL(18,2) NOT NULL,
    [Pagado] BIT DEFAULT 0
);

-- 5. MÓDULO DE SOPORTE TÉCNICO (Requisito para BE-07)
CREATE TABLE [dbo].[MotivoReporte] (
    [MotivoId] INT IDENTITY(1,1) PRIMARY KEY,
    [Titulo] VARCHAR(100) NOT NULL,
    [Gravedad] INT DEFAULT 1
);

CREATE TABLE [dbo].[TicketSoporte] (
    [TicketId] INT IDENTITY(1,1) PRIMARY KEY,
    [UsuarioId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Usuario]([UsuarioId]),
    [MotivoId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[MotivoReporte]([MotivoId]),
    [FechaCreacion] DATETIME DEFAULT GETDATE(),
    [Estado] VARCHAR(20) DEFAULT 'Abierto'
);

CREATE TABLE [dbo].[TicketMensaje] (
    [MensajeId] INT IDENTITY(1,1) PRIMARY KEY,
    [TicketId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[TicketSoporte]([TicketId]),
    [RemitenteEsSoporte] BIT DEFAULT 0,
    [CuerpoMensaje] TEXT NOT NULL,
    [FechaEnvio] DATETIME DEFAULT GETDATE()
);

CREATE TABLE [dbo].[TicketAdjunto] (
    [AdjuntoId] INT IDENTITY(1,1) PRIMARY KEY,
    [MensajeId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[TicketMensaje]([MensajeId]),
    [UrlArchivo] VARCHAR(255) NOT NULL,
    [TipoMime] VARCHAR(50) NOT NULL
);

-- 6. MÓDULO DE MÉTODOS DE PAGO Y NOTIFICACIONES
CREATE TABLE [dbo].[Notificacion] (
    [NotificacionId] INT IDENTITY(1,1) PRIMARY KEY,
    [UsuarioId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Usuario]([UsuarioId]),
    [Titulo] VARCHAR(100) NOT NULL,
    [Mensaje] VARCHAR(255) NOT NULL,
    [Leida] BIT DEFAULT 0,
    [FechaEmision] DATETIME DEFAULT GETDATE()
);

CREATE TABLE [dbo].[MetodoPagoExterno] (
    [MetodoId] INT IDENTITY(1,1) PRIMARY KEY,
    [UsuarioId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Usuario]([UsuarioId]),
    [Tipo] VARCHAR(50) NOT NULL, 
    [UltimosCuatro] CHAR(4) NOT NULL,
    [EntidadEmisora] VARCHAR(100) NOT NULL
);

-- 7. REQUERIMIENTO TPI CLASE 7: ALTER TABLE PARA CAMPO JSON
-- Nota Franco: Se agrega a la tabla Movimiento (creada por Lautaro/Fabri)
ALTER TABLE [dbo].[Movimiento] ADD [MetadataExtranjera] NVARCHAR(MAX) NULL;
ALTER TABLE [dbo].[Movimiento] ADD CONSTRAINT [CHK_Movimiento_Metadata_JSON] CHECK (ISJSON([MetadataExtranjera]) = 1);
GO

-- 7b. SEEDS DE ROLES (BE-11)
-- Mínimo necesario para que [Authorize(Roles="...")] tenga datos contra los que matchear.
IF NOT EXISTS (SELECT 1 FROM dbo.Rol WHERE Nombre = N'User')
    INSERT INTO dbo.Rol (Nombre, Descripcion) VALUES (N'User', N'Usuario final de la app');
IF NOT EXISTS (SELECT 1 FROM dbo.Rol WHERE Nombre = N'Admin')
    INSERT INTO dbo.Rol (Nombre, Descripcion) VALUES (N'Admin', N'Operador con acceso administrativo');
GO

-- 8. ANULACIÓN DE MOVIMIENTOS (BE-09)
-- Flag + timestamp para anular operaciones sin perder la traza original.
-- La reversión de saldo se ejecuta en la misma transacción desde la API.
IF COL_LENGTH(N'dbo.Movimiento', N'Anulado') IS NULL
    ALTER TABLE [dbo].[Movimiento] ADD [Anulado] BIT NOT NULL CONSTRAINT [DF_Movimiento_Anulado] DEFAULT (0);
GO
IF COL_LENGTH(N'dbo.Movimiento', N'FechaAnulacion') IS NULL
    ALTER TABLE [dbo].[Movimiento] ADD [FechaAnulacion] DATETIME NULL;
GO


