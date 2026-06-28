// FE-10 · Contactar soporte
// Form: chips de tema + textarea de mensaje → POST /api/tickets-soporte
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fonts, radii, spacing, type } from '@/theme/tokens';
import { crearTicket, TEMAS_SOPORTE } from '@/api/soporte';
import { ApiError } from '@/api/client';
import { useSession } from '@/context/SessionContext';

export default function SupportContactScreen() {
  const { usuario } = useSession();
  const [temaIdx, setTemaIdx] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnviar = async () => {
    if (temaIdx === null) {
      setError('Seleccioná un tema.');
      return;
    }
    if (!mensaje.trim()) {
      setError('Escribí tu mensaje.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const tema = TEMAS_SOPORTE[temaIdx];
      await crearTicket({
        motivoId: tema.motivoId,
        cuerpoMensaje: mensaje.trim(),
        adjuntos: [],
      });
      router.replace({
        pathname: '/support-sent',
        params: { email: usuario?.email ?? '' },
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 0
          ? 'Sin conexión al servidor.'
          : err.mensaje || 'Error al enviar el mensaje.');
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={20}
        >
          <ScreenHeader title="Contactar soporte" />

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.subtitle}>
              Contanos qué pasó. Te respondemos por email.
            </Text>

            {/* Tema */}
            <Text style={styles.sectionLabel}>TEMA</Text>
            <View style={styles.chips}>
              {TEMAS_SOPORTE.map((t, i) => (
                <Pressable
                  key={t.label}
                  style={[styles.chip, temaIdx === i && styles.chipSelected]}
                  onPress={() => { setTemaIdx(i); setError(null); }}
                >
                  <Text style={[styles.chipText, temaIdx === i && styles.chipTextSelected]}>
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Mensaje */}
            <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>MENSAJE</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Describí tu consulta o problema..."
                placeholderTextColor={colors.dim}
                multiline
                textAlignVertical="top"
                value={mensaje}
                onChangeText={v => { setMensaje(v); setError(null); }}
                editable={!isLoading}
              />
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable
              style={[styles.btn, isLoading && { opacity: 0.6 }]}
              onPress={handleEnviar}
              disabled={isLoading}
            >
              {isLoading
                ? <ActivityIndicator color={colors.ctaText} />
                : <Text style={styles.btnText}>Enviar mensaje</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 20,
  },
  subtitle: {
    ...type.body,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...type.label,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipSelected: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(57,195,242,0.12)',
  },
  chipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13.5,
    color: colors.muted,
  },
  chipTextSelected: {
    color: colors.cyan,
  },
  textAreaWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minHeight: 140,
    padding: spacing.md,
  },
  textArea: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    color: colors.text,
    minHeight: 120,
    lineHeight: 22,
  },
  errorBanner: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)',
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: '#f87171',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 28,
    paddingTop: spacing.sm,
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
