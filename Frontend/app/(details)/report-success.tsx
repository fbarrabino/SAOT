// FE-15 · Reportar problema — enviado
// Confirmación con número de caso (TicketId formateado)
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fonts, radii, spacing, type } from '@/theme/tokens';

export default function ReportSuccessScreen() {
  const { ticketId } = useLocalSearchParams<{ ticketId?: string }>();

  // Formateamos como "#138725" — padding con ceros a 6 dígitos
  const numeroCaso = `#${(ticketId ?? '0').padStart(6, '0')}`;

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScreenHeader title="Reportar problema" />

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

          <Text style={styles.title}>Reporte{'\n'}enviado</Text>
          <Text style={styles.subtitle}>
            Estamos revisando tu caso. Vas a recibir un email con la actualización en las próximas 24 horas.
          </Text>

          {/* Badge número de caso */}
          <View style={styles.casoBadge}>
            <Text style={styles.casoLabel}>Caso</Text>
            <Text style={styles.casoNumber}>{numeroCaso}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={styles.btn}
            onPress={() => router.dismissAll()}
          >
            <Text style={styles.btnText}>Volver</Text>
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
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xxl,
  },
  casoBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radii.button,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  casoLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  casoNumber: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.text,
    letterSpacing: -0.3,
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
