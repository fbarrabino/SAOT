// Enviar #2 — Monto + selector de billetera origen.
// Patrón compartido con Pedir/Cambiar: chip "Para" arriba + display de monto
// + selector de wallet + teclado numérico + CTA contextual.
// Reglas (de saot-demo.js): monto > 0 y monto ≤ saldo de billetera origen.
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { AmountDisplay } from '@/components/AmountDisplay';
import { ContactAvatar } from '@/components/ContactAvatar';
import { NumericKeypad } from '@/components/NumericKeypad';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TxHeader } from '@/components/TxHeader';
import { WalletGlyph } from '@/components/WalletGlyph';
import { findContact } from '@/data/contacts';
import { WALLETS, findWallet, type WalletKey } from '@/data/wallets';
import { amountValue, fmt, fmtCompact } from '@/utils/format';
import { colors, fonts, radii } from '@/theme/tokens';

export default function SendAmount() {
  const params = useLocalSearchParams<{ to?: string }>();
  const contact = findContact(params.to ?? 'lr') ?? findContact('lr')!;
  const [from, setFrom] = useState<WalletKey>('mp');
  const [amt, setAmt] = useState('150'); // valor inicial alineado al mockup

  const fromWallet = findWallet(from);
  const n = amountValue(amt);
  const insufficient = n > fromWallet.bal;
  const valid = n > 0 && !insufficient;

  const ctaLabel =
    n <= 0
      ? 'Elegí un monto'
      : insufficient
      ? 'Saldo insuficiente'
      : `Enviar ${fmt(n)}`;

  function next() {
    if (!valid) return;
    router.push({
      pathname: '/(send)/confirm',
      params: { to: contact.id, from, amt: String(n) },
    });
  }

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <TxHeader title="Enviar" />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.toRow}>
            <ContactAvatar initials={contact.initials} color={contact.color} size={36} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.toLabel}>Para</Text>
              <Text style={styles.toName}>{contact.name}</Text>
            </View>
          </View>

          <Text style={styles.amtLabel}>Monto</Text>
          <AmountDisplay text={fmtCompact(n)} size={60} variant="plain" />
          <Text style={styles.availability}>
            Disponible · <Text style={{ color: colors.text }}>{fmt(fromWallet.bal)}</Text>
          </Text>

          <View style={styles.fromRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <WalletGlyph wallet={from} size={32} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.fromLabel}>Desde</Text>
                <Text style={styles.fromName}>{fromWallet.name}</Text>
              </View>
            </View>

            <View style={styles.swatch}>
              {WALLETS.map(w => (
                <Pressable
                  key={w.key}
                  onPress={() => setFrom(w.key)}
                  style={[
                    styles.swatchDot,
                    from === w.key && styles.swatchDotOn,
                  ]}
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
            label={ctaLabel}
            disabled={!valid}
            onPress={next}
            style={{ marginTop: 18 }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 18, paddingBottom: 24 },
  toRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  toLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.dim },
  toName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.text, marginTop: 1 },
  amtLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 22,
  },
  availability: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.dim,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 18,
  },
  fromRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: radii.card,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  fromLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.dim },
  fromName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.text, marginTop: 1 },
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
