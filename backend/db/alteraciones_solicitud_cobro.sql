/* ============================================================================
   alteraciones_solicitud_cobro.sql
   ----------------------------------------------------------------------------
   Agrega los campos necesarios para la tarea "Maestro-detalle: Pedido/Cobro".
   Ejecutar UNA sola vez, DESPUÉS de init.sql.
   Es idempotente: cada ALTER usa IF NOT EXISTS sobre la columna.
   ============================================================================ */

USE BilleterasDB;
GO

-- ── SolicitudCobro: Descripcion + FechaCreacion ───────────────────────────────

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.SolicitudCobro') AND name = N'Descripcion'
)
    ALTER TABLE dbo.SolicitudCobro
        ADD Descripcion NVARCHAR(250) NULL;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.SolicitudCobro') AND name = N'FechaCreacion'
)
    ALTER TABLE dbo.SolicitudCobro
        ADD FechaCreacion DATETIME NOT NULL CONSTRAINT DF_SolicitudCobro_FechaCreacion DEFAULT (GETUTCDATE());
GO

-- ── SolicitudCobroDetalle: Concepto + MovimientoId ───────────────────────────

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.SolicitudCobroDetalle') AND name = N'Concepto'
)
    ALTER TABLE dbo.SolicitudCobroDetalle
        ADD Concepto NVARCHAR(250) NULL;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.SolicitudCobroDetalle') AND name = N'MovimientoId'
)
BEGIN
    ALTER TABLE dbo.SolicitudCobroDetalle
        ADD MovimientoId INT NULL;

    ALTER TABLE dbo.SolicitudCobroDetalle
        ADD CONSTRAINT FK_SolicitudCobroDetalle_Movimiento
        FOREIGN KEY (MovimientoId) REFERENCES dbo.Movimiento(MovimientoId);
END
GO

PRINT 'Alteraciones de SolicitudCobro y SolicitudCobroDetalle aplicadas correctamente.';
GO
