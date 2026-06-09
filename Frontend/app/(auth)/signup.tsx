import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Input } from '@/components/Input';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, fonts, radii, type } from '@/theme/tokens';

export default function Signup() {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScreenHeader title="Crear cuenta" />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.lead}>Una sola cuenta para todas tus billeteras.</Text>

          <View style={styles.form}>
            <Input label="Nombre" placeholder="Tu nombre completo" autoCapitalize="words" />
            <Input label="Email" placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" />
            <Input label="Contraseña" placeholder="Mínimo 8 caracteres" password />
            <Input label="Confirmar contraseña" placeholder="Repetí la contraseña" password />

            <Pressable style={styles.terms} onPress={() => setChecked(c => !c)}>
              <View style={[styles.checkbox, checked && styles.checkboxOn]}>
                {checked ? (
                  <Svg width={12} height={12} viewBox="0 0 24 24">
                    <Path
                      d="M5 12l5 5 9-12"
                      stroke={colors.ctaText}
                      strokeWidth={3}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : null}
              </View>
              <Text style={styles.termsText}>
                Acepto los <Text style={styles.link}>Términos</Text> y la{' '}
                <Text style={styles.link}>Política de Privacidad</Text> de SaOT.
              </Text>
            </Pressable>
          </View>

          <PrimaryButton
            label="Crear cuenta"
            onPress={() => router.replace('/(tabs)/home')}
            style={{ marginTop: 22 }}
            disabled={!checked}
          />

          <View style={styles.footer}>
            <Text style={styles.footerMuted}>¿Ya tenés cuenta? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Ingresar</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingTop: 10, paddingBottom: 32, flexGrow: 1 },
  lead: { ...type.body, marginBottom: 22 },
  form: {},
  terms: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8, gap: 10 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  termsText: { flex: 1, color: colors.muted, fontFamily: fonts.body, fontSize: 13 },
  link: { color: colors.cyan, fontFamily: fonts.bodyBold },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerMuted: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted },
  footerLink: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.cyan },
});
