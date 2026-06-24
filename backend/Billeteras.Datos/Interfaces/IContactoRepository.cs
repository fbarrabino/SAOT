using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

public interface IContactoRepository
{
    Task<IEnumerable<Contacto>> GetContactosDeUsuarioAsync(int usuarioPropietarioId);
    Task<Contacto> AddAsync(Contacto contacto);
    Task DeleteAsync(int usuarioPropietarioId, int usuarioContactoId);
}