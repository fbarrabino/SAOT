using Microsoft.EntityFrameworkCore;
using Billeteras.Entidades;
using Billeteras.Datos.Interfaces;

namespace Billeteras.DatosEF;

public class ContactoRepositoryEF(BilleterasContext context) : IContactoRepository
{
    public async Task<IEnumerable<Contacto>> GetContactosDeUsuarioAsync(int usuarioPropietarioId) 
        => await context.Contactos
            .Where(c => c.UsuarioPropietarioId == usuarioPropietarioId)
            .ToListAsync();

    public async Task<Contacto> AddAsync(Contacto contacto)
    {
        context.Contactos.Add(contacto);
        await context.SaveChangesAsync();
        return contacto;
    }

    public async Task DeleteAsync(int usuarioPropietarioId, int usuarioContactoId)
    {
        var contacto = await context.Contactos.FindAsync(usuarioPropietarioId, usuarioContactoId);
        if (contacto != null)
        {
            context.Contactos.Remove(contacto);
            await context.SaveChangesAsync();
        }
    }
}