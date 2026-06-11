// Cambiar #2 — Confirmar cambio.
// Resumen Desde/A/Monto/Tasa/Comisión/Llega + CTA "Confirmar cambio" con gradiente lime.
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { AmountDisplay } from '@/components/AmountDisplay';
import { TxHeader } from '@/components/TxHeader';
import { WalletGlyph } from '@/components/WalletGlyph';
import { findWallet, type WalletKey } from '@/data/wallets';
import { fmt } from '@/utils/format';
import { colors, fonts, gradients, radii, shadow } from '@/theme/tokens';

export default function ExchangeConfirm() {
  const { from, to, amt, fee } = useLocalSearchParams<{
    from?: WalletKey;
    to?: WalletKey;
    amt?: string;
    fee?: string;
  }>();

  const fromWallet = findWallet((from as WalletKey) ?? 'mp');
  const toWallet = findWallet((to as WalletKey) ?? 'lm');
  const n = Number(amt ?? 0);
  const f = Number(fee ?? 0);
  const willReceive = +Math.max(0, n - f).toFixed(2);

  function confirm() {
    router.replace({
      pathname: '/(exchange)/success',
      params: { from: fromWallet.key, to: toWallet.key, amt: String(n), receive: String(willReceive) },
    });
  }

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TxHeader title="Confirmar cambio" />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.lbl}>Recibirás</Text>
          <AmountDisplay text={fmt(willReceive)} variant="green" size={48} />

          <View style={styles.card}>
            <Row
              label="Desde"
              right={
                <View style={styles.rightRow}>
                  <WalletGlyph wallet={fromWallet.key} size={22} />
                  <Text style={styles.value}>{fromWallet.name}</Text>
                </View>
              }
            />
            <Row
              label="A"
              right={
                <View style={styles.rightRow}>
                  <WalletGlyph wallet={toWallet.key} size={22} />
                  <Text style={styles.value}>{toWallet.name}</Text>
                </View>
              }
            />
            <Row label="Monto" right={<Text style={styles.value}>{fmt(n)}</Text>} />
            <Row label="Tasa" right={<Text style={styles.value}>1.00</Text>} />
            <Row label="Comisión" right={<Text style={styles.value}>{fmt(f)}</Text>} />
            <Row label="Llega" right={<Text style={styles.value}>Al instante</Text>} last />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={[shadow.cta, { borderRadius: radii.button }]}>
            <Pressable onPress={confirm} android_ripple={{ color: 'rgba(0,0,0,0.12)' }}>
              <LinearGradient
                colors={gradients.lime}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cta}
              >
                <Text style={styles.ctaText}>Confirmar cambio</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Row({
  label,
  right,
  last,
}: {
  label: string;
  right: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 18, paddingBottom: 24 },
  lbl: {
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 8,
  },
  card: {
    marginTop: 18,
    borderRadius: radii.cardLg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomColor: colors.hairline,
    borderBottomWidth: 1,
  },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  value: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.text },
  footer: { paddingHorizontal: 18, paddingBottom: 14 },
  cta: {
    height: 54,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.ctaText },
});
