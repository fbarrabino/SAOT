// Pedir #2 — QR de cobro.
// Genera una grilla pseudo-aleatoria 13×13 (igual al qrCells() del prototipo) sobre
// un tile blanco redondeado. Abajo: link saot.app/r/<usuario>-<id> + acciones
// "Copiar link" y "Compartir".
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { AmountDisplay } from '@/components/AmountDisplay';
import { TxHeader } from '@/components/TxHeader';
import { WalletGlyph } from '@/components/WalletGlyph';
import { findWallet, type WalletKey } from '@/data/wallets';
import { fmt } from '@/utils/format';
import { colors, fonts, radii } from '@/theme/tokens';

const QR_GRID = 13;

function buildCells() {
  // Patrón determinístico para que no parpadee en re-renders.
  // Mantiene "marquitos" en las 3 esquinas (eyes) como un QR real.
  const cells = new Array(QR_GRID * QR_GRID).fill(false);
  for (let r = 0; r < QR_GRID; r++) {
    for (let c = 0; c < QR_GRID; c++) {
      const i = r * QR_GRID + c;
      // pseudo-random reproducible
      cells[i] = ((r * 31 + c * 17 + r * c) % 7) % 2 === 0;
    }
  }
  // Eyes (3 esquinas 3x3)
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

export default function RequestQR() {
  const { into, amt } = useLocalSearchParams<{ into?: WalletKey; amt?: string }>();
  const wallet = findWallet((into as WalletKey) ?? 'mp');
  const n = Number(amt ?? 0);
  const cells = useMemo(buildCells, []);

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TxHeader title="Pedir pago" />

        <View style={styles.body}>
          <Text style={styles.label}>Pedir</Text>
          <AmountDisplay text={fmt(n)} variant="cyan" size={32} />

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
                <WalletGlyph wallet={wallet.key} size={28} />
              </View>
            </View>
          </View>

          <Text style={styles.helper}>Escaneá con SaOT o cualquier billetera asociada para pagar</Text>
          <Text style={styles.link}>saot.app/r/fabricio-2261</Text>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.action}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M8 4h10a2 2 0 012 2v12M4 8v12a2 2 0 002 2h12"
                stroke={colors.text}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.actionText}>Copiar link</Text>
          </Pressable>
          <Pressable style={styles.action}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 16V4M7 9l5-5 5 5M5 20h14"
                stroke={colors.text}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.actionText}>Compartir</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const QR_TILE = 220;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 18, paddingTop: 4 },
  label: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
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
  link: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  action: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  actionText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.text },
});
