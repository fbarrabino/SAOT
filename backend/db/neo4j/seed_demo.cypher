// =============================================================================
// SaOT — Seed Cypher de demo (BD-04)
// =============================================================================
// Espeja en Neo4j los nodos y relaciones que producirían los hooks de la API
// cuando estén activos en todo el equipo (registro de usuario, vincular cuenta,
// agregar contacto, etc.). Los datos referencian IDs reales de SQL:
//
//   Usuarios:   1 = Fabricio, 2 = Lautaro
//   Billeteras: 1 = Mercado Pago, 2 = Ualá
//   Cuentas:    1 = fabri-mp, 2 = fabri-uala, 3 = lautaro-mp
//   Movimientos generados por la API:
//      Cambiar (movs 1,2): cuenta 1 -> cuenta 2 por $500
//      Enviar  (mov 3):    egreso de cuenta 1 por $200
//      PagarQR (mov 4):    egreso de cuenta 1 por $24.80 a "Café Buenos Aires"
//
// Pegar todo este archivo en el Neo4j Browser y ejecutar.
// =============================================================================

// ─── Nodos base ───────────────────────────────────────────────────────────────
MERGE (u1:Usuario {usuarioId: 1}) SET u1.nombre = "Fabricio", u1.email = "fabri.demo@saot.test";
MERGE (u2:Usuario {usuarioId: 2}) SET u2.nombre = "Lautaro",  u2.email = "lautaro.demo@saot.test";

MERGE (b1:Billetera {billeteraId: 1}) SET b1.nombre = "Mercado Pago";
MERGE (b2:Billetera {billeteraId: 2}) SET b2.nombre = "Ualá";

MERGE (c1:CuentaBilletera {cuentaBilleteraId: 1}) SET c1.alias = "fabri-mp",   c1.saldoActual = 4275.20;
MERGE (c2:CuentaBilletera {cuentaBilleteraId: 2}) SET c2.alias = "fabri-uala", c2.saldoActual = 3500.00;
MERGE (c3:CuentaBilletera {cuentaBilleteraId: 3}) SET c3.alias = "lautaro-mp", c3.saldoActual = 2000.00;

// ─── Relaciones de propiedad y uso (las generaría VincularAsync de Lautaro) ──
MATCH (u1:Usuario {usuarioId: 1}), (c1:CuentaBilletera {cuentaBilleteraId: 1}) MERGE (u1)-[:TIENE]->(c1);
MATCH (u1:Usuario {usuarioId: 1}), (c2:CuentaBilletera {cuentaBilleteraId: 2}) MERGE (u1)-[:TIENE]->(c2);
MATCH (u2:Usuario {usuarioId: 2}), (c3:CuentaBilletera {cuentaBilleteraId: 3}) MERGE (u2)-[:TIENE]->(c3);

MATCH (c1:CuentaBilletera {cuentaBilleteraId: 1}), (b1:Billetera {billeteraId: 1}) MERGE (c1)-[:USA]->(b1);
MATCH (c2:CuentaBilletera {cuentaBilleteraId: 2}), (b2:Billetera {billeteraId: 2}) MERGE (c2)-[:USA]->(b2);
MATCH (c3:CuentaBilletera {cuentaBilleteraId: 3}), (b1:Billetera {billeteraId: 1}) MERGE (c3)-[:USA]->(b1);

// ─── Contacto entre usuarios (lo generaría ContactoNegocio.AgregarAsync) ─────
MATCH (u1:Usuario {usuarioId: 1}), (u2:Usuario {usuarioId: 2})
MERGE (u1)-[:ES_CONTACTO_DE]->(u2);

// ─── TRANSFIRIO — Cambiar (BE-04) y un Enviar interno hipotético ─────────────
// Movimiento 1 (egreso) + 2 (ingreso) = un cambio entre cuentas del mismo user.
MATCH (origen:CuentaBilletera {cuentaBilleteraId: 1}),
      (destino:CuentaBilletera {cuentaBilleteraId: 2})
CREATE (origen)-[:TRANSFIRIO {
    movimientoId: 1,
    monto: 500.0,
    fecha: datetime(),
    descripcion: "Cambio MP->Uala demo"
}]->(destino);

// Un envío interno demo (cuenta de Fabricio -> cuenta de Lautaro).
// La API actual no lo registra automáticamente; lo agregamos a mano para que
// la consulta "red de transferencias" tenga al menos dos saltos.
MATCH (origen:CuentaBilletera {cuentaBilleteraId: 2}),
      (destino:CuentaBilletera {cuentaBilleteraId: 3})
CREATE (origen)-[:TRANSFIRIO {
    movimientoId: 99,
    monto: 150.0,
    fecha: datetime(),
    descripcion: "Envio demo a Lautaro"
}]->(destino);

// ─── Pago QR (BE-05) — Comercio + PAGO_EN + ACEPTA ───────────────────────────
MERGE (co:Comercio {comercioId: 1})
SET co.razonSocial = "Café Buenos Aires", co.cuit = "30-12345678-9";

MATCH (c:CuentaBilletera {cuentaBilleteraId: 1}),
      (co:Comercio {comercioId: 1})
CREATE (c)-[:PAGO_EN {
    movimientoId: 4,
    monto: 24.80,
    fecha: datetime()
}]->(co);

MATCH (c:CuentaBilletera {cuentaBilleteraId: 1})-[:USA]->(b:Billetera),
      (co:Comercio {comercioId: 1})
MERGE (co)-[:ACEPTA]->(b);

// ─── Verificación rápida ─────────────────────────────────────────────────────
MATCH (n) RETURN labels(n)[0] AS tipo, count(n) AS cantidad ORDER BY tipo;
MATCH ()-[r]->() RETURN type(r) AS relacion, count(r) AS cantidad ORDER BY relacion;
