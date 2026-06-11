// Pedir #1 — Monto a pedir + billetera destinataria.
// No valida saldo (es un cobro). El CTA queda deshabilitado hasta que haya monto > 0.
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { AmountDisplay } from '@/components/AmountDisplay';
import { NumericKeypad } from '@/components/NumericKeypad';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { WalletGlyph } from '@/components/WalletGlyph';
import { WALLETS, findWallet, type WalletKey } from '@/data/wallets';
import { amountValue, fmtCompact } from '@/utils/format';
import { colors, fonts, radii } from '@/theme/tokens';

export default function RequestAmount() {
  const [into, setInto] = useState<WalletKey>('mp');
  const [amt, setAmt] = useState('500');

  const n = amountValue(amt);
  const valid = n > 0;
  const wallet = findWallet(into);

  function next() {
    if (!valid) return;
    router.push({
      pathname: '/(request)/qr',
      params: { into, amt: String(n) },
    });
  }

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScreenHeader title="Pedir" />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Monto a pedir</Text>
          <AmountDisplay text={fmtCompact(n)} size={60} variant="plain" />

          <View style={styles.intoRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <WalletGlyph wallet={into} size={32} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.intoLabel}>Recibir en</Text>
                <Text style={styles.intoName}>{wallet.name}</Text>
              </View>
            </View>

            <View style={styles.swatch}>
              {WALLETS.map(w => (
                <Pressable
                  key={w.key}
                  onPress={() => setInto(w.key)}
                  style={[styles.swatchDot, into === w.key && styles.swatchDotOn]}
                >
                  <WalletGlyph wallet={w.key} size={22} />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <NumericKeypad value={amt} onChange={setAmt} />
          </View>

          <PrimaryButton
            label={valid ? 'Generar QR' : 'Generá un monto'}
            disabled={!valid}
            onPress={next}
            style={{ marginTop: 14 }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 18, paddingBottom: 24 },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  intoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: radii.card,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  intoLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.dim },
  intoName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.text, marginTop: 1 },
  swatch: { flexDirection: 'row', gap: 6 },
  swatchDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchDotOn: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(57,195,242,0.16)',
  },
});
