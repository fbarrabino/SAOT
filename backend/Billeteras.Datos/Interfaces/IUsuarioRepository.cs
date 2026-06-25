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

    /// BE-11 — Devuelve los nombres de los roles asignados al usuario
    /// (UsuarioRol JOIN Rol). Lista vacía si el usuario no tiene roles
    /// explícitos: el AuthController igual le asigna "User" por defecto.
    Task<List<string>> ObtenerNombresRolesAsync(int usuarioId);
}