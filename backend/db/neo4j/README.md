# Neo4j — Scripts de demo (BD-04)

Scripts para poblar y consultar la base de grafos asociada al sistema SaOT.
Pensados para correrse contra la instancia local de Neo4j Desktop
(`bolt://localhost:7687`) y dejar el grafo en un estado consistente con SQL
para sacar las capturas que pide el informe BD-04 (sección 3.9).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `seed_demo.cypher` | Crea los nodos base (Usuario, Billetera, CuentaBilletera, Comercio) y las relaciones que producirían los hooks de la API una vez enganchados: `TIENE`, `USA`, `ES_CONTACTO_DE`, `TRANSFIRIO`, `PAGO_EN`, `ACEPTA`. Usa los IDs reales del seed SQL (usuarios 1/2, billeteras 1/2, cuentas 1/2/3) para que el grafo refleje los movimientos generados por la API. |
| `queries_demo.cypher` | Las consultas de negocio de la sección 3.9 del documento BD-04: panorama del grafo, comercios frecuentes, red de transferencias, billeteras en común. Cada una pensada para ejecutarse aislada y sacarle captura. |

## Cómo ejecutarlos

### Desde el Neo4j Browser (recomendado para capturas)

1. Abrir Neo4j Desktop → instancia **Saot** → botón **Open** → Browser.
2. Conectarse a la BD `neo4j` (la default).
3. Abrir el archivo `.cypher` con el editor del Browser (o pegar el contenido).
4. Ejecutar todo el bloque o consulta por consulta.

### Desde la línea de comandos (`cypher-shell`)

```powershell
$shell = 'C:\Users\<usuario>\.Neo4jDesktop2\Data\dbmss\<dbms-id>\bin\cypher-shell.bat'

# Poblar el grafo
& $shell -a 'bolt://localhost:7687' -u 'neo4j' -p '<password>' --file seed_demo.cypher

# Correr una consulta puntual
& $shell -a 'bolt://localhost:7687' -u 'neo4j' -p '<password>' --format plain `
  'MATCH (n) RETURN labels(n)[0] AS tipo, count(n) AS cantidad ORDER BY tipo;'
```

## Convenciones (importante para el equipo)

**Nombres de relaciones SIN tilde**: `TRANSFIRIO`, `PAGO_EN`, `SOLICITO_COBRO`,
no `TRANSFIRIÓ` / `PAGÓ_EN` / `SOLICITÓ_COBRO`. Decisión tomada para evitar
problemas de encoding entre Windows / Linux y no requerir backticks en los
Cypher. Si el documento BD-01 originalmente proponía los nombres con tilde,
alinear todo a esta convención (find / replace en docs y queries) o reemplazar
en los scripts y envolver en backticks (`` `TRANSFIRIÓ` ``).

## Estado actual de hooks de la API (BD-04)

| Evento | Lugar en código | Hook activo |
|---|---|---|
| Registro de usuario | `UsuarioNegocio.RegistrarAsync` | ⏳ Lautaro |
| Vincular cuenta | `CuentaBilleteraNegocio` (BE-08) | ⏳ Lautaro |
| Agregar contacto | `ContactoNegocio.AgregarAsync` | ⏳ Franco |
| Transferencia (Enviar / Cambiar) | `OperacionesNegocio` (BE-03/04) | ⏳ Fabri (DTOs ya extensibles) |
| Pago QR | `OperacionesNegocio.PagarQrAsync` (BE-05) | ⏳ Fabri |
| Solicitud de cobro | `SolicitudCobroNegocio.CrearAsync` | ⏳ Lautaro |
| Línea pagada | `SolicitudCobroNegocio.PagarLineaAsync` | ⏳ Lautaro |

Mientras los hooks no estén activos, el grafo se mantiene actualizado corriendo
`seed_demo.cypher` después de cada cambio relevante en SQL. Una vez que cada
hook quede enganchado en el código de Negocio (con su correspondiente
`INeo4jService.ExecuteAsync(...)` después del commit SQL), la sección
equivalente de `seed_demo.cypher` se puede eliminar y el grafo se va a poblar
solo en tiempo real con cada operación de la API.
