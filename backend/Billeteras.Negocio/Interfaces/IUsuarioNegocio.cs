using Billeteras.Negocio.Dtos;

namespace Billeteras.Negocio.Interfaces;

public interface IUsuarioNegocio
{
    Task<List<UsuarioResponse>> ObtenerTodosAsync();
    Task<UsuarioResponse?> ObtenerPorIdAsync(int id);

    /// Registra un usuario nuevo. Devuelve null si el email ya existe.
    Task<UsuarioResponse?> RegistrarAsync(RegistrarUsuarioRequest req);

    /// Valida email + contraseña (BCrypt). Devuelve null si las credenciales son inválidas.
    Task<UsuarioResponse?> AutenticarAsync(string email, string password);

    /// Actualiza un usuario. Devuelve null si no existe.
    Task<UsuarioResponse?> ActualizarAsync(int id, UsuarioUpdateRequest req);

    Task<bool> EliminarAsync(int id);
}