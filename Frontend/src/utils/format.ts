// Formato de moneda es-AR. Mantengo dos firmas distintas para
// no andar parseando enteros como pesos sin centavos:
//  - fmt(n)        -> "$1.234,56"   (siempre 2 decimales)
//  - fmtCompact(n) -> "$1.234"      (sin decimales si es entero, útil en pantalla de monto en tipeo)
export const fmt = (n: number) =>
  '$' +
  n.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const fmtCompact = (n: number) => {
  const hasFraction = Math.abs(n - Math.trunc(n)) > 1e-9;
  return (
    '$' +
    n.toLocaleString('es-AR', {
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: 2,
    })
  );
};

// Convierte el string del teclado numérico (con punto decimal) a number.
export const amountValue = (s: string) => parseFloat(s || '0') || 0;
