using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

/// Operaciones de dominio que necesitan ejecutar varios cambios bajo una
/// misma transacción de base de datos: inserción de movimiento(s) +
/// actualización de saldo(s). El control transaccional (BeginTransaction,
/// Commit, Rollback) vive en la implementación EF para no acoplarlo a la
/// capa de Negocio.
public interface IOperacionesRepository
{
    /// BE-03 — Resta `monto` del saldo de `cuentaOrigenId` e inserta un
    /// movimiento de egreso. Devuelve el id del movimiento y el saldo final.
    /// Lanza InvalidOperationException si el saldo es insuficiente o si la
    /// cuenta/categoría no existen; en ambos casos la transacción se revierte.
    Task<(int movimientoId, decimal saldoOrigenFinal)> EnviarAsync(
        int cuentaOrigenId,
        int categoriaId,
        decimal monto,
        string? descripcion);
}
