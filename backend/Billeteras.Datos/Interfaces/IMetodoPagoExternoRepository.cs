using Billeteras.Entidades;

namespace Billeteras.Datos.Interfaces;

public interface IMetodoPagoExternoRepository
{
    Task<IEnumerable<MetodoPagoExterno>> GetAllAsync();
    Task<MetodoPagoExterno?> GetByIdAsync(int id);
    Task<IEnumerable<MetodoPagoExterno>> GetByUsuarioIdAsync(int usuarioId);
    Task<MetodoPagoExterno> AddAsync(MetodoPagoExterno metodo);
    Task DeleteAsync(int id);
}