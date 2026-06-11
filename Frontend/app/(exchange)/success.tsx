// Cambiar #3 — Completado.
// Mismo patrón que send-success pero con ícono de "intercambio" en lima y CTA único "Listo".
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { findWallet, type WalletKey } from '@/data/wallets';
import { fmt } from '@/utils/format';
import { colors, fonts, gradients, radii, shadow } from '@/theme/tokens';

export default function ExchangeSuccess() {
  const { from, to, receive } = useLocalSearchParams<{
    from?: WalletKey;
    to?: WalletKey;
    receive?: string;
  }>();
  const fromWallet = findWallet((from as WalletKey) ?? 'mp');
  const toWallet = findWallet((to as WalletKey) ?? 'lm');
  const n = Number(receive ?? 0);

  function done() {
    router.dismissAll?.();
    router.replace('/(tabs)/home');
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
            <Svg width={32} height={32} viewBox="0 0 24 24">
              <Path
                d="M4 8h13l-3-3M20 16H7l3 3"
                stroke="#06121A"
                strokeWidth={2.4}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.title}>Cambio completado</Text>
          <Text style={styles.sub}>
            {fmt(n)} desde {fromWallet.name} a {toWallet.name}.
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={[shadow.cta, { borderRadius: radii.button }]}>
            <Pressable onPress={done} android_ripple={{ color: 'rgba(0,0,0,0.12)' }}>
              <LinearGradient
                colors={gradients.lime}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cta}
              >
                <Text style={styles.ctaText}>Listo</Text>
              </LinearGradient>
            </Pressable>
          </View>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 24,
    color: colors.text,
    marginTop: 20,
    letterSpacing: -0.4,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 13.5,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  footer: { padding: 18 },
  cta: {
    height: 54,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.ctaText },
});
