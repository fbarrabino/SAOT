using Microsoft.Data.SqlClient;
using Billeteras.Datos.Interfaces;
using Billeteras.Entidades;

namespace Billeteras.Datos;

/// Implementación ADO.NET puro del repositorio de Movimiento.
/// Los SELECT hacen INNER JOIN para traer el nombre de la categoría y el alias de la cuenta.
public class MovimientoRepositoryAdo(string connectionString) : IMovimientoRepository
{
    private const string SelectBase = @"
        SELECT m.MovimientoId, m.CuentaBilleteraId, m.CategoriaId, m.Fecha, m.Descripcion, m.Monto, m.Tipo,
               cat.Nombre AS CategoriaNombre,
               c.Alias AS CuentaAlias
        FROM Movimiento m
        INNER JOIN Categoria cat ON cat.CategoriaId = m.CategoriaId
        INNER JOIN CuentaBilletera c ON c.CuentaBilleteraId = m.CuentaBilleteraId";

    public async Task<List<Movimiento>> ObtenerTodosAsync()
    {
        var lista = new List<Movimiento>();
        const string sql = SelectBase + ";";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        await conn.OpenAsync();
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            lista.Add(Map(reader));

        return lista;
    }

    public async Task<Movimiento?> ObtenerPorIdAsync(int id)
    {
        const string sql = SelectBase + " WHERE m.MovimientoId = @id;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        await conn.OpenAsync();
        using var reader = await cmd.ExecuteReaderAsync();
        return await reader.ReadAsync() ? Map(reader) : null;
    }

    public async Task<int> InsertarAsync(Movimiento entidad)
    {
        // No se actualiza el SaldoActual de la cuenta (eso es TP-06).
        const string sql = @"INSERT INTO Movimiento (CuentaBilleteraId, CategoriaId, Fecha, Descripcion, Monto, Tipo)
                             VALUES (@cuentaBilleteraId, @categoriaId, @fecha, @descripcion, @monto, @tipo);
                             SELECT CAST(SCOPE_IDENTITY() AS int);";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@cuentaBilleteraId", entidad.CuentaBilleteraId);
        cmd.Parameters.AddWithValue("@categoriaId", entidad.CategoriaId);
        cmd.Parameters.AddWithValue("@fecha", entidad.Fecha);
        cmd.Parameters.AddWithValue("@descripcion", (object?)entidad.Descripcion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@monto", entidad.Monto);
        cmd.Parameters.AddWithValue("@tipo", entidad.Tipo);
        await conn.OpenAsync();
        return (int)(await cmd.ExecuteScalarAsync())!;
    }

    public async Task<bool> ActualizarAsync(Movimiento entidad)
    {
        const string sql = @"UPDATE Movimiento
                             SET CuentaBilleteraId = @cuentaBilleteraId, CategoriaId = @categoriaId, Fecha = @fecha,
                                 Descripcion = @descripcion, Monto = @monto, Tipo = @tipo
                             WHERE MovimientoId = @id;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@cuentaBilleteraId", entidad.CuentaBilleteraId);
        cmd.Parameters.AddWithValue("@categoriaId", entidad.CategoriaId);
        cmd.Parameters.AddWithValue("@fecha", entidad.Fecha);
        cmd.Parameters.AddWithValue("@descripcion", (object?)entidad.Descripcion ?? DBNull.Value);
        cmd.Parameters.AddWithValue("@monto", entidad.Monto);
        cmd.Parameters.AddWithValue("@tipo", entidad.Tipo);
        cmd.Parameters.AddWithValue("@id", entidad.MovimientoId);
        await conn.OpenAsync();
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        const string sql = "DELETE FROM Movimiento WHERE MovimientoId = @id;";

        using var conn = new SqlConnection(connectionString);
        using var cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        await conn.OpenAsync();
        return await cmd.ExecuteNonQueryAsync() > 0;
    }

    private static Movimiento Map(SqlDataReader reader) => new()
    {
        MovimientoId = reader.GetInt32(reader.GetOrdinal("MovimientoId")),
        CuentaBilleteraId = reader.GetInt32(reader.GetOrdinal("CuentaBilleteraId")),
        CategoriaId = reader.GetInt32(reader.GetOrdinal("CategoriaId")),
        Fecha = reader.GetDateTime(reader.GetOrdinal("Fecha")),
        Descripcion = reader.IsDBNull(reader.GetOrdinal("Descripcion")) ? null : reader.GetString(reader.GetOrdinal("Descripcion")),
        Monto = reader.GetDecimal(reader.GetOrdinal("Monto")),
        Tipo = reader.GetString(reader.GetOrdinal("Tipo")),
        // Navegaciones parcialmente cargadas vía JOIN.
        Categoria = new Categoria { Nombre = reader.GetString(reader.GetOrdinal("CategoriaNombre")) },
        CuentaBilletera = new CuentaBilletera { Alias = reader.IsDBNull(reader.GetOrdinal("CuentaAlias")) ? null : reader.GetString(reader.GetOrdinal("CuentaAlias")) }
    };
}