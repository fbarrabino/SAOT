import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CodeInput } from '@/components/CodeInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, fonts, type } from '@/theme/tokens';

export default function ResetCode() {
  const [code, setCode] = useState('');

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={20}
        >
          {/* Tocar fuera del input cierra el teclado para poder llegar al CTA */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }}>
              <ScreenHeader title="Restablecer contraseña" />
              <View style={styles.body}>
                <Text style={styles.title}>Ingresá el código</Text>
                <Text style={styles.lead}>Te enviamos un código de 6 dígitos al email.</Text>

                <View style={{ marginTop: 28 }}>
                  <CodeInput length={6} onChange={setCode} />
                </View>

                <Pressable onPress={() => {}} style={styles.resend}>
                  <Text style={styles.resendText}>Reenviar código</Text>
                </Pressable>
              </View>

              <View style={styles.footer}>
                <PrimaryButton
                  label="Verificar código"
                  onPress={() => {
                    Keyboard.dismiss();
                    router.push('/(auth)/reset-new-password');
                  }}
                  disabled={code.length < 6}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, padding: 20, paddingTop: 18 },
  title: { ...type.display, fontSize: 24, marginBottom: 6 },
  lead: { ...type.body, lineHeight: 20 },
  resend: { alignSelf: 'center', marginTop: 26, paddingVertical: 8 },
  resendText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.cyan },
  footer: { padding: 20 },
});
