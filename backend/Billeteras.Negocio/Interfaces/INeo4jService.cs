using Neo4j.Driver;

namespace Billeteras.Negocio.Interfaces;

/// Abstracción mínima sobre el driver de Neo4j para que las clases de Negocio
/// puedan disparar Cypher tras los commits SQL (graph como espejo eventual del
/// estado financiero). El IDriver es thread-safe → la implementación se
/// registra como Singleton.
public interface INeo4jService
{
    /// Ejecuta un Cypher de escritura (CREATE, MERGE, SET, CREATE CONSTRAINT...)
    /// sin esperar resultado. El cursor se consume internamente.
    Task ExecuteAsync(string cypher, object? parameters = null);

    /// Ejecuta un Cypher de lectura y materializa los IRecord en lista.
    /// Pensado para reportes / consultas de la sección 3.9.
    Task<List<IRecord>> QueryAsync(string cypher, object? parameters = null);
}
