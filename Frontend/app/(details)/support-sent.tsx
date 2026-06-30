// FE-11 · Soporte — enviado
// Confirmación tras enviar mensaje a soporte
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fonts, radii, spacing, type } from '@/theme/tokens';

export default function SupportSentScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const displayEmail = email || 'tu email';

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScreenHeader title="Contactar soporte" />

        <View style={styles.body}>
          {/* Ícono de éxito */}
          <View style={styles.iconOuter}>
            <Svg width={56} height={56} viewBox="0 0 56 56">
              <Circle cx={28} cy={28} r={28} fill="rgba(74,222,128,0.18)" />
              <Circle cx={28} cy={28} r={20} fill="rgba(74,222,128,0.28)" />
              <Path
                d="M18 28l7 7 13-14"
                stroke={colors.green}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </View>

          <Text style={styles.title}>Mensaje{'\n'}enviado</Text>
          <Text style={styles.subtitle}>
            Te respondemos a{' '}
            <Text style={{ color: colors.cyan }}>{displayEmail}</Text>
            {' '}en menos de 24 horas.
          </Text>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.btn}
            onPress={() => router.back()}
          >
            <Text style={styles.btnText}>Listo</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconOuter: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.displayBold,
    fontSize: 34,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...type.body,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 28,
  },
  btn: {
    height: 52,
    borderRadius: radii.button,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    ...type.button,
    color: colors.ctaText,
  },
});
