// Detalle de transacción — Bloque 3 #04 / #05
// Maneja las dos variantes en el mismo screen:
//   • Egreso  → monto blanco con "-",  subtítulo "Pagado con X"
//   • Ingreso → monto verde  con "+",  subtítulo "Recibido vía X"
// Lee ?id=... de los params y busca el movimiento en WalletsContext.
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { WalletGlyph } from '@/components/WalletGlyph';
import { useWallets } from '@/context/WalletsContext';
import { colors, fonts, radii, spacing, type } from '@/theme/tokens';
import { fmt } from '@/utils/format';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { activity } = useWallets();

  // Buscamos el movimiento por id. Si no llegó id o no se encuentra,
  // caemos al primero como fallback para no dejar la pantalla en blanco
  // si alguien navega directo desde un deep link de prueba.
  const tx = activity.find(a => a.id === id) ?? activity[0];

  if (!tx) {
    return (
      <View style={styles.container}>
        <AuroraBackground />
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
          <ScreenHeader title="Transacción" />
          <View style={styles.emptyWrap}>
            <Text style={type.body}>No se encontró la transacción.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const isIncoming = tx.kind === 'in';
  const sign = isIncoming ? '+' : '-';
  const amountColor = isIncoming ? colors.green : colors.text;
  const subtitle = isIncoming ? `Recibido vía ${tx.walletName}` : `Pagado con ${tx.walletName}`;
  const category = isIncoming ? 'Ingreso' : 'Egreso';
  // Fecha mostrada: combinamos el bucket (HOY / AYER / 10 MAY) con la hora.
  const dateLabel = `${tx.bucket.toLowerCase().replace(/^\w/, c => c.toUpperCase())} · ${tx.time}`;
  const reference = `TX-${String(tx.id).padStart(5, '0').slice(-5)}`;

  return (
    <View style={styles.container}>
      <AuroraBackground />

      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScreenHeader title="Transacción" />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerTx}>
            <WalletGlyph wallet={tx.wallet} size={64} />
            <Text style={styles.subtitle}>{subtitle}</Text>
            <Text style={[styles.amount, { color: amountColor }]}>
              {sign}
              {fmt(Math.abs(tx.amount))}
            </Text>
            <Text style={styles.date}>{dateLabel}</Text>
          </View>

          <View style={styles.detailsCard}>
            <DetailRow label="Descripción" value={tx.title} />
            <DetailRow label="Categoría" value={category} />
            <DetailRow label="Estado" value="Completado" />
            <DetailRow label="Referencia" value={reference} noBorder />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => router.push({ pathname: '/receipt-share', params: { id: tx.id } })}
          >
            <Text style={[type.button, { color: colors.text }]}>Compartir recibo</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => router.push({ pathname: '/report-reason', params: { id: tx.id } })}
          >
            <Text style={[type.button, { color: colors.text }]}>Reportar problema</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function DetailRow({
  label,
  value,
  noBorder,
}: {
  label: string;
  value: string;
  noBorder?: boolean;
}) {
  return (
    <View style={[styles.detailRow, !noBorder && styles.detailRowBorder]}>
      <Text style={type.body}>{label}</Text>
      <Text style={type.bodyText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerTx: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  subtitle: {
    ...type.body,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  amount: {
    fontFamily: fonts.displayBold,
    fontSize: 38,
    letterSpacing: -0.5,
  },
  date: {
    ...type.small,
    marginTop: spacing.xs,
  },
  detailsCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  secondaryBtn: {
    flex: 1,
    height: 52,
    borderRadius: radii.button,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
});
