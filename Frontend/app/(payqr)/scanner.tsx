// Pagar QR — placeholder.
// El diseño final (cámara escaneando con frame de esquinas + línea animada)
// pertenece al Bloque 3. Acá dejamos una pantalla mínima con:
//  - Header "Pagar QR"
//  - Un QR de ejemplo (grilla determinística, mismo patrón que /(request)/qr)
//  - Subtítulo y un CTA "Continuar" que vuelve al home.
// Cuando el Bloque 3 esté implementado se reemplaza esta vista por la real.
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TxHeader } from '@/components/TxHeader';
import { colors, fonts } from '@/theme/tokens';

const QR_GRID = 13;

function buildCells() {
  const cells = new Array(QR_GRID * QR_GRID).fill(false);
  for (let r = 0; r < QR_GRID; r++) {
    for (let c = 0; c < QR_GRID; c++) {
      const i = r * QR_GRID + c;
      cells[i] = ((r * 31 + c * 17 + r * c) % 7) % 2 === 0;
    }
  }
  // Eyes en 3 esquinas (3x3) — patrón clásico QR.
  const eyes: Array<[number, number]> = [
    [0, 0],
    [0, QR_GRID - 3],
    [QR_GRID - 3, 0],
  ];
  for (const [er, ec] of eyes) {
    for (let dr = 0; dr < 3; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        const i = (er + dr) * QR_GRID + (ec + dc);
        const onBorder = dr === 0 || dr === 2 || dc === 0 || dc === 2;
        const middle = dr === 1 && dc === 1;
        cells[i] = onBorder || middle;
      }
    }
  }
  return cells;
}

export default function PayQRScanner() {
  const cells = useMemo(buildCells, []);

  function done() {
    router.dismissAll?.();
    router.replace('/(tabs)/home');
  }

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TxHeader title="Pagar QR" />

        <View style={styles.body}>
          <Text style={styles.lbl}>Escaneá el QR para pagar</Text>

          <View style={styles.qrTile}>
            <View style={styles.qrGrid}>
              {cells.map((on, i) => (
                <View
                  key={i}
                  style={[
                    styles.qrCell,
                    { backgroundColor: on ? '#06121A' : 'transparent' },
                  ]}
                />
              ))}
              <View style={styles.qrCenter}>
                <Svg width={22} height={22} viewBox="0 0 24 24">
                  <Path
                    d="M21 3L3 11l7 2 2 7 9-17z"
                    stroke={colors.cyan}
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </View>
          </View>

          <Text style={styles.helper}>
            Apuntá la cámara al QR del comercio o pegalo desde la galería.
          </Text>

          <Text style={styles.note}>
            (Placeholder — el flujo real con cámara llega en el Bloque 3.)
          </Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Continuar" onPress={done} />
          <Pressable onPress={() => router.back()} style={styles.outline}>
            <Text style={styles.outlineText}>Cancelar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const QR_TILE = 220;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 18, paddingTop: 12 },
  lbl: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  qrTile: {
    width: QR_TILE,
    height: QR_TILE,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGrid: {
    width: QR_TILE - 28,
    height: QR_TILE - 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrCell: {
    width: `${100 / QR_GRID}%`,
    height: `${100 / QR_GRID}%`,
  },
  qrCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -22 }, { translateY: -22 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 24,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.dim,
    textAlign: 'center',
    marginTop: 10,
  },
  footer: { padding: 18, gap: 10 },
  outline: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  outlineText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.text },
});
