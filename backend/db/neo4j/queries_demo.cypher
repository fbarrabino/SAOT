// =============================================================================
// SaOT — Consultas de negocio (sección 3.9 de BD-04)
// =============================================================================
// Pegar una a una en el Neo4j Browser y sacar captura del resultado.
// Si el doc oficial de Lautaro usa nombres con tilde (TRANSFIRIÓ, PAGÓ_EN,
// SOLICITÓ_COBRO), reemplazar antes de correr.
// =============================================================================

// ─── (1) Grafo completo — captura "panorama" ─────────────────────────────────
MATCH (n) RETURN n LIMIT 100;


// ─── (2) Comercios más frecuentes para una cuenta ────────────────────────────
// Pregunta: ¿En qué comercios paga más seguido la cuenta de Fabricio?
MATCH (c:CuentaBilletera {cuentaBilleteraId: 1})-[:PAGO_EN]->(co:Comercio)
RETURN co.razonSocial AS comercio,
       count(*)       AS cantidadPagos
ORDER BY cantidadPagos DESC;


// ─── (3) Red de transferencias de un usuario ─────────────────────────────────
// Pregunta: ¿A quién/qué cuentas le transfirió Fabricio (directo o indirecto)?
MATCH path = (u:Usuario {usuarioId: 1})-[:TIENE]->(:CuentaBilletera)-[:TRANSFIRIO*1..2]->(destino:CuentaBilletera)
OPTIONAL MATCH (destino)<-[:TIENE]-(dueno:Usuario)
RETURN u.nombre        AS origen,
       destino.alias   AS cuentaDestino,
       dueno.nombre    AS duenoDestino,
       length(path)    AS saltos;


// ─── (4) Billeteras en común entre dos usuarios ──────────────────────────────
// Pregunta: ¿Qué billeteras usan los dos? Útil para sugerir transferencias internas.
MATCH (u1:Usuario {usuarioId: 1})-[:TIENE]->(:CuentaBilletera)-[:USA]->(b:Billetera)<-[:USA]-(:CuentaBilletera)<-[:TIENE]-(u2:Usuario {usuarioId: 2})
RETURN DISTINCT b.nombre AS billeteraEnComun;


// ─── (5) Cobros pendientes — pendiente de hooks de Lautaro ───────────────────
// El nodo :SolicitudCobro y la relación :SOLICITO_COBRO los crea
// SolicitudCobroNegocio.CrearAsync cuando esté enganchada. Mientras tanto,
// dejamos el Cypher escrito para que coincida con el doc de Lautaro:
//
//   MATCH (u:Usuario {usuarioId: 1})-[:SOLICITO_COBRO]->(s:SolicitudCobro)
//   WHERE s.estado = "Pendiente"
//   RETURN s.solicitudId, s.montoTotal, s.fechaVencimiento;
