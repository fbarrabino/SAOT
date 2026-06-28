// FE-13 · Reportar problema — motivo
// Lista de motivos con radio buttons. Recibe ?id= de la transacción.
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { WalletGlyph } from '@/components/WalletGlyph';
import { useWallets } from '@/context/WalletsContext';
import { colors, fonts, radii, spacing, type } from '@/theme/tokens';
import { MOTIVOS_REPORTE } from '@/api/soporte';
import { fmt } from '@/utils/format';

export default function ReportReasonScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { activity } = useWallets();
  const [selected, setSelected] = useState<number | null>(null);

  const tx = activity.find(a => a.id === id) ?? activity[0];

  const handleContinuar = () => {
    if (selected === null) return;
    const motivo = MOTIVOS_REPORTE[selected];
    router.push({
      pathname: '/report-detail',
      params: {
        id: id ?? '',
        motivoIdx: String(selected),
        motivoLabel: motivo.label,
        motivoId: String(motivo.motivoId),
      },
    });
  };

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScreenHeader title="Reportar problema" />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Mini-tarjeta de la transacción */}
          {tx && (
            <View style={styles.txCard}>
              <WalletGlyph wallet={tx.wallet} size={40} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txSub}>
                  {tx.walletName} · {tx.bucket.toLowerCase().replace(/^\w/, c => c.toUpperCase())} · {tx.time}
                </Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.kind === 'in' ? colors.green : colors.text }]}>
                {tx.kind === 'out' ? '-' : '+'}${fmt(Math.abs(tx.amount))}
              </Text>
            </View>
          )}

          {/* Lista de motivos */}
          <Text style={styles.sectionLabel}>¿QUÉ PROBLEMA TUVISTE?</Text>

          <View style={styles.motivos}>
            {MOTIVOS_REPORTE.map((m, i) => (
              <Pressable
                key={m.label}
                style={[styles.motivoRow, i < MOTIVOS_REPORTE.length - 1 && styles.motivoRowBorder]}
                onPress={() => setSelected(i)}
              >
                <Text style={[styles.motivoText, selected === i && { color: colors.text }]}>
                  {m.label}
                </Text>
                {/* Radio button */}
                <View style={[styles.radio, selected === i && styles.radioSelected]}>
                  {selected === i && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.btn, selected === null && styles.btnDisabled]}
            onPress={handleContinuar}
            disabled={selected === null}
          >
            <Text style={[styles.btnText, selected === null && { color: colors.muted }]}>
              Continuar
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 20 },

  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  txTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.text,
  },
  txSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  txAmount: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    letterSpacing: -0.3,
  },

  sectionLabel: {
    ...type.label,
    marginBottom: spacing.md,
  },

  motivos: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  motivoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
  },
  motivoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  motivoText: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    color: colors.muted,
    flex: 1,
    marginRight: spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.cyan,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.cyan,
  },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 28,
    paddingTop: spacing.sm,
  },
  btn: {
    height: 52,
    borderRadius: radii.button,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    ...type.button,
    color: colors.text,
  },
});
