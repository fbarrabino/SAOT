import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { WalletGlyph } from '@/components/WalletGlyph';
import { colors, fonts, gradients, radii, type } from '@/theme/tokens';

const fmt = (n: number) =>
  '$' +
  n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const WALLETS = [
  { key: 'mp' as const, name: 'Mercado Pago', sub: 'Vinculada · ARG', bal: 3200.5, tint: gradients.mpTint },
  { key: 'ua' as const, name: 'Ualá', sub: 'Vinculada · ARG', bal: 1500.0, tint: gradients.uaTint },
  { key: 'lm' as const, name: 'Lemon', sub: 'Vinculada · ARG', bal: 7749.75, tint: gradients.lmTint },
];

export default function Wallets() {
  const total = WALLETS.reduce((s, w) => s + w.bal, 0);

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.h1}>Billeteras</Text>
          <Text style={styles.subhead}>
            Balance combinado · <Text style={{ color: colors.text }}>{fmt(total)}</Text>
          </Text>

          <View style={styles.list}>
            {WALLETS.map(w => (
              <LinearGradient
                key={w.key}
                colors={w.tint}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.row}
              >
                <WalletGlyph wallet={w.key} size={42} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.name}>{w.name}</Text>
                  <Text style={styles.sub}>{w.sub}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.amt}>{fmt(w.bal)}</Text>
                  <Text style={styles.amtSub}>Disponible</Text>
                </View>
              </LinearGradient>
            ))}

            <Pressable style={styles.addRow}>
              <View style={styles.plusCircle}>
                <Svg width={18} height={18} viewBox="0 0 24 24" stroke={colors.muted} strokeWidth={2.2} fill="none" strokeLinecap="round">
                  <Path d="M12 5v14M5 12h14" />
                </Svg>
              </View>
              <Text style={styles.addText}>Conectar otra billetera</Text>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 120 },
  h1: { fontFamily: fonts.displayBold, fontSize: 30, color: colors.text, letterSpacing: -0.5 },
  subhead: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 6, marginBottom: 22 },
  list: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  name: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.text },
  sub: { fontFamily: fonts.body, fontSize: 11.5, color: colors.dim, marginTop: 2 },
  amt: { fontFamily: fonts.displayBold, fontSize: 15, color: colors.text },
  amtSub: { fontFamily: fonts.body, fontSize: 10.5, color: colors.green, marginTop: 2 },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginTop: 6,
  },
  plusCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { flex: 1, marginLeft: 12, fontFamily: fonts.bodySemi, fontSize: 14, color: colors.text },
  chev: { fontFamily: fonts.body, fontSize: 18, color: colors.dim },
});
