/* ============================================================================
   Billeteras — Script de inicialización de la base de datos
   Unificador de Billeteras Virtuales · Equipo O'T · Programación III · UTN FRRe
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
