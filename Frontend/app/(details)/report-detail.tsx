// FE-14 · Reportar problema — detalle
// Textarea con descripción + adjuntar captura (opcional)
// POST /api/tickets-soporte → navega a report-success con ticketId
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Rect } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fonts, radii, spacing, type } from '@/theme/tokens';
import { crearTicket } from '@/api/soporte';
import { ApiError } from '@/api/client';

export default function ReportDetailScreen() {
  const { id, motivoLabel, motivoId } = useLocalSearchParams<{
    id?: string;
    motivoLabel?: string;
    motivoId?: string;
  }>();

  const [detalle, setDetalle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdjuntar = () => {
    // expo-image-picker no está instalado aún.
    // Para habilitarlo: pnpm add expo-image-picker
    Alert.alert('Próximamente', 'La función de adjuntar capturas estará disponible en la próxima versión.');
  };

  const handleEnviar = async () => {
    if (!detalle.trim()) {
      setError('Describí el problema antes de enviar.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const parsedMotivoId = parseInt(motivoId ?? '4', 10);
      const ticket = await crearTicket({
        motivoId: parsedMotivoId,
        cuerpoMensaje: detalle.trim(),
        adjuntos: [], // las imágenes requerirían upload a storage; por ahora vacío
      });
      router.replace({
        pathname: '/report-success',
        params: { ticketId: String(ticket.ticketId) },
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 0
          ? 'Sin conexión al servidor.'
          : err.mensaje || 'Error al enviar el reporte.');
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
          <ScreenHeader title="Reportar problema" />

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Motivo seleccionado */}
            {motivoLabel ? (
              <Text style={styles.motivoBadge}>
                <Text style={{ color: colors.muted }}>Motivo: </Text>
                <Text style={{ color: colors.cyan }}>{motivoLabel}</Text>
              </Text>
            ) : null}

            {/* Textarea */}
            <Text style={styles.sectionLabel}>CONTANOS MÁS</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Describí el problema con el mayor detalle posible..."
                placeholderTextColor={colors.dim}
                multiline
                textAlignVertical="top"
                value={detalle}
                onChangeText={v => { setDetalle(v); setError(null); }}
                editable={!isLoading}
              />
            </View>

            {/* Adjuntar captura */}
            <Pressable style={styles.adjuntarRow} onPress={handleAdjuntar} disabled={isLoading}>
              <View style={styles.adjuntarIcon}>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none"
                  stroke={colors.cyan} strokeWidth={2}
                  strokeLinecap="round" strokeLinejoin="round">
                  <Rect x={3} y={3} width={18} height={18} rx={2} />
                  <Path d="M8.5 8.5m-1.5 0a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0" />
                  <Path d="M21 15l-5-5L5 21" />
                </Svg>
              </View>
              <View>
                <Text style={styles.adjuntarText}>Adjuntar captura</Text>
                <Text style={styles.adjuntarSub}>(opcional)</Text>
              </View>
            </Pressable>

            {/* Error */}
            {error ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              style={[styles.btn, isLoading && { opacity: 0.6 }]}
              onPress={handleEnviar}
              disabled={isLoading}
            >
              {isLoading
                ? <ActivityIndicator color={colors.ctaText} />
                : <Text style={styles.btnText}>Enviar reporte</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 20 },

  motivoBadge: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    marginBottom: spacing.xl,
  },

  sectionLabel: {
    ...type.label,
    marginBottom: spacing.sm,
  },

  textAreaWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minHeight: 140,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  textArea: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    color: colors.text,
    minHeight: 120,
    lineHeight: 22,
  },

  adjuntarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    gap: spacing.md,
  },
  adjuntarIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.icon,
    backgroundColor: 'rgba(57,195,242,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjuntarText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.text,
  },
  adjuntarSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
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
