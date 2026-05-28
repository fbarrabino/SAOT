using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

/// Contrato del repositorio de Usuario. Lo implementan tanto la versión ADO.NET
/// (Billeteras.Datos) como la versión EF Core (Billeteras.DatosEF).
public interface IUsuarioRepository
{
    Task<List<Usuario>> ObtenerTodosAsync();
    Task<Usuario?> ObtenerPorIdAsync(int id);
    Task<Usuario?> ObtenerPorEmailAsync(string email);
    Task<int> InsertarAsync(Usuario entidad);
    Task<bool> ActualizarAsync(Usuario entidad);
    Task<bool> EliminarAsync(int id);
}