using Microsoft.Data.SqlClient;
using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;

namespace Billeteras.Datos;

/// Implementación ADO.NET puro del repositorio de Billetera.
public class BilleteraRepositoryAdo(string connectionString) : IBilleteraRepository
{
    public async Task<List<Billetera>> ObtenerTodosAsync()
    {
        var lista = new List<Billetera>();
        const string sql = "SELECT BilleteraId, Nombre, LogoUrl FROM Billetera;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        await conn.OpenAsync();
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            lista.Add(Map(reader));

        return lista;
    }

    public async Task<Billetera?> ObtenerPorIdAsync(int id)
    {
        const string sql = "SELECT BilleteraId, Nombre, LogoUrl FROM Billetera WHERE BilleteraId = @id;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        await conn.OpenAsync();
        using var reader = await cmd.ExecuteReaderAsync();
        return await reader.ReadAsync() ? Map(reader) : null;
    }

    public async Task<int> InsertarAsync(Billetera entidad)
    {
        const string sql = @"INSERT INTO Billetera (Nombre, LogoUrl)
                             VALUES (@nombre, @logoUrl);
                             SELECT CAST(SCOPE_IDENTITY() AS int);";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@nombre", entidad.Nombre);
        cmd.Parameters.AddWithValue("@logoUrl", (object?)entidad.LogoUrl ?? DBNull.Value);
        await conn.OpenAsync();
        return (int)(await cmd.ExecuteScalarAsync())!;
    }

    public async Task<bool> ActualizarAsync(Billetera entidad)
    {
        const string sql = @"UPDATE Billetera
                             SET Nombre = @nombre, LogoUrl = @logoUrl
                             WHERE BilleteraId = @id;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@nombre", entidad.Nombre);
        cmd.Parameters.AddWithValue("@logoUrl", (object?)entidad.LogoUrl ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@id", entidad.BilleteraId);
        await conn.OpenAsync();
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        const string sql = "DELETE FROM Billetera WHERE BilleteraId = @id;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        await conn.OpenAsync();
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    private static Billetera Map(SqlDataReader reader) => new()
    {
        BilleteraId = reader.GetInt32(reader.GetOrdinal("BilleteraId")),
        Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
        LogoUrl = reader.IsDBNull(reader.GetOrdinal("LogoUrl")) ? null : reader.GetString(reader.GetOrdinal("LogoUrl"))
    };
}