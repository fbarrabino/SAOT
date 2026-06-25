using Microsoft.Data.SqlClient;
using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;

namespace Billeteras.Datos;

/// Implementación ADO.NET puro del repositorio de CuentaBilletera.
/// Los SELECT hacen INNER JOIN para traer el nombre de la billetera y del usuario.
public class CuentaBilleteraRepositoryAdo(string connectionString) : ICuentaBilleteraRepository
{
    private const string SelectBase = @"
        SELECT c.CuentaBilleteraId, c.UsuarioId, c.BilleteraId, c.Alias, c.SaldoActual, c.FechaVinculacion, c.Estado,
               b.Nombre AS BilleteraNombre,
               u.Nombre AS UsuarioNombre, u.Apellido AS UsuarioApellido
        FROM CuentaBilletera c
        INNER JOIN Billetera b ON b.BilleteraId = c.BilleteraId
        INNER JOIN Usuario u ON u.UsuarioId = c.UsuarioId";

    public async Task<List<CuentaBilletera>> ObtenerTodosAsync()
    {
        var lista = new List<CuentaBilletera>();
        const string sql = SelectBase + ";";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        await conn.OpenAsync();
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            lista.Add(Map(reader));

        return lista;
    }

    public async Task<CuentaBilletera?> ObtenerPorIdAsync(int id)
    {
        const string sql = SelectBase + " WHERE c.CuentaBilleteraId = @id;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        await conn.OpenAsync();
        using var reader = await cmd.ExecuteReaderAsync();
        return await reader.ReadAsync() ? Map(reader) : null;
    }

    public async Task<int> InsertarAsync(CuentaBilletera entidad)
    {
        // FechaVinculacion queda en manos del default GETDATE() de la DB.
        const string sql = @"INSERT INTO CuentaBilletera (UsuarioId, BilleteraId, Alias, SaldoActual)
                             VALUES (@usuarioId, @billeteraId, @alias, @saldoActual);
                             SELECT CAST(SCOPE_IDENTITY() AS int);";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@usuarioId", entidad.UsuarioId);
        cmd.Parameters.AddWithValue("@billeteraId", entidad.BilleteraId);
        cmd.Parameters.AddWithValue("@alias", (object?)entidad.Alias ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@saldoActual", entidad.SaldoActual);
        await conn.OpenAsync();
        return (int)(await cmd.ExecuteScalarAsync())!;
    }

    public async Task<bool> ActualizarAsync(CuentaBilletera entidad)
    {
        const string sql = @"UPDATE CuentaBilletera
                             SET UsuarioId = @usuarioId, BilleteraId = @billeteraId, Alias = @alias, SaldoActual = @saldoActual
                             WHERE CuentaBilleteraId = @id;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@usuarioId", entidad.UsuarioId);
        cmd.Parameters.AddWithValue("@billeteraId", entidad.BilleteraId);
        cmd.Parameters.AddWithValue("@alias", (object?)entidad.Alias ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@saldoActual", entidad.SaldoActual);
        cmd.Parameters.AddWithValue("@id", entidad.CuentaBilleteraId);
        await conn.OpenAsync();
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        const string sql = "DELETE FROM CuentaBilletera WHERE CuentaBilleteraId = @id;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        await conn.OpenAsync();
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    /// <summary>
    /// VincularAsync y DesvincularAsync no están implementados en ADO.NET — delegar a EF.
    /// Este repositorio ADO se usa solo para el módulo MVC (vista), no para la API REST.
    /// </summary>
    public Task<CuentaBilletera> VincularAsync(int usuarioId, int billeteraId, string? alias)
        => throw new NotSupportedException("VincularAsync solo está implementado en CuentaBilleteraRepositoryEF.");

    public Task<CuentaBilletera> DesvincularAsync(int cuentaBilleteraId, int usuarioId)
        => throw new NotSupportedException("DesvincularAsync solo está implementado en CuentaBilleteraRepositoryEF.");

    private static CuentaBilletera Map(SqlDataReader reader) => new()
    {
        CuentaBilleteraId = reader.GetInt32(reader.GetOrdinal("CuentaBilleteraId")),
        UsuarioId = reader.GetInt32(reader.GetOrdinal("UsuarioId")),
        BilleteraId = reader.GetInt32(reader.GetOrdinal("BilleteraId")),
        Alias = reader.IsDBNull(reader.GetOrdinal("Alias")) ? null : reader.GetString(reader.GetOrdinal("Alias")),
        SaldoActual = reader.GetDecimal(reader.GetOrdinal("SaldoActual")),
        FechaVinculacion = reader.GetDateTime(reader.GetOrdinal("FechaVinculacion")),
        Estado = reader.IsDBNull(reader.GetOrdinal("Estado")) ? "Activa" : reader.GetString(reader.GetOrdinal("Estado")),
        // Navegaciones parcialmente cargadas vía JOIN (solo los nombres que necesita la vista).
        Billetera = new Billetera { Nombre = reader.GetString(reader.GetOrdinal("BilleteraNombre")) },
        Usuario = new Usuario
        {
            Nombre = reader.GetString(reader.GetOrdinal("UsuarioNombre")),
            Apellido = reader.GetString(reader.GetOrdinal("UsuarioApellido"))
        }
    };
}