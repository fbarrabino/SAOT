// Enviar #4 — Éxito.
// Pantalla full-screen con check verde + título + subtítulo + dos CTAs
// (Listo → vuelve a home · Enviar otro → vuelve al recipient).
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { PrimaryButton } from '@/components/PrimaryButton';
import { findContact } from '@/data/contacts';
import { findWallet, type WalletKey } from '@/data/wallets';
import { fmt } from '@/utils/format';
import { colors, fonts } from '@/theme/tokens';

export default function SendSuccess() {
  const { to, from, amt } = useLocalSearchParams<{ to?: string; from?: WalletKey; amt?: string }>();
  const contact = findContact(to ?? '') ?? findContact('lr')!;
  const wallet = findWallet((from as WalletKey) ?? 'mp');
  const n = Number(amt ?? 0);

  function done() {
    // Vuelta al home, descartando todo el stack del flujo Enviar.
    router.dismissAll?.();
    router.replace('/(tabs)/home');
  }

  function sendAnother() {
    router.replace('/(send)/recipient');
  }

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.closeRow}>
          <Pressable onPress={done} hitSlop={10} style={styles.closeBtn}>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M6 6l12 12M18 6L6 18" stroke={colors.muted} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.check}>
            <Svg width={36} height={36} viewBox="0 0 24 24">
              <Path
                d="M5 12l5 5 9-12"
                stroke={colors.green}
                strokeWidth={2.6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.title}>Enviado con éxito</Text>
          <Text style={styles.sub}>
            {fmt(n)} a {contact.name} desde {wallet.name}.
          </Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Listo" onPress={done} />
          <Pressable onPress={sendAnother} style={styles.outline}>
            <Text style={styles.outlineText}>Enviar otro</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  closeRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 18, paddingTop: 6 },
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  check: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(74,222,128,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 24,
    color: colors.text,
    marginTop: 22,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
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
