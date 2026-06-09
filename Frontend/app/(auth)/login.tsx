import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { AppIcon } from '@/components/AppIcon';
import { Input } from '@/components/Input';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SocialButton } from '@/components/SocialButton';
import { colors, fonts, type } from '@/theme/tokens';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.iconWrap}>
            <AppIcon size={72} />
          </View>

          <Text style={styles.title}>Hola de nuevo</Text>
          <Text style={styles.subtitle}>
            Ingresá para ver tus billeteras y operar desde un solo lugar.
          </Text>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="tu@email.com"
            />
            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              password
              placeholder="••••••••"
            />

            <Link href="/(auth)/forgot-password" asChild>
              <Pressable style={styles.forgotWrap}>
                <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
              </Pressable>
            </Link>

            <PrimaryButton
              label="Ingresar"
              onPress={() => router.replace('/(tabs)/home')}
              style={{ marginTop: 8 }}
            />

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>O CONTINUAR CON</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socials}>
              <SocialButton label="Apple" />
              <SocialButton label="Google" />
              <SocialButton label="Face ID" />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerMuted}>¿No tenés cuenta? </Text>
            <Link href="/(auth)/signup" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Crear cuenta</Text>
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
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 36,
    flexGrow: 1,
  },
  iconWrap: { alignItems: 'center', marginBottom: 22 },
  title: {
    ...type.display,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...type.body,
    textAlign: 'center',
    marginBottom: 26,
    paddingHorizontal: 18,
  },
  form: { marginTop: 6 },
  forgotWrap: { alignSelf: 'flex-end', marginTop: 2, marginBottom: 16, paddingVertical: 4 },
  forgot: { ...type.link, fontSize: 13 },
  divider: { flexDirection: 'row', alignItems: 'center', marginTop: 26, marginBottom: 16, gap: 12 },
  line: { flex: 1, height: 1, backgroundColor: colors.hairline },
  dividerText: { ...type.label, color: colors.dim, fontSize: 10.5 },
  socials: { flexDirection: 'row', gap: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerMuted: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted },
  footerLink: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.cyan },
});
