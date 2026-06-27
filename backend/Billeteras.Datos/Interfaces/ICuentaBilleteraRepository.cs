using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

public interface ICuentaBilleteraRepository
{
    Task<List<CuentaBilletera>> ObtenerTodosAsync();
    Task<CuentaBilletera?> ObtenerPorIdAsync(int id);
    Task<int> InsertarAsync(CuentaBilletera entidad);
    Task<bool> ActualizarAsync(CuentaBilletera entidad);
    Task<bool> EliminarAsync(int id);

    /// <summary>Vincula una billetera al usuario con transacción. Valida existencia y duplicado activo.</summary>
    Task<CuentaBilletera> VincularAsync(int usuarioId, int billeteraId, string? alias);

    /// <summary>Desvincula (soft-delete) la cuenta. Valida ownership, estado Activa y saldo == 0.</summary>
    Task<CuentaBilletera> DesvincularAsync(int cuentaBilleteraId, int usuarioId);
}