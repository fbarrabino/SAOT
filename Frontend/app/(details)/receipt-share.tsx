// FE-12 · Compartir recibo
// Preview del recibo de una transacción + opciones de compartir
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Share,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { WalletGlyph } from '@/components/WalletGlyph';
import { useWallets } from '@/context/WalletsContext';
import { colors, fonts, radii, spacing, type } from '@/theme/tokens';
import { fmt } from '@/utils/format';

export default function ReceiptShareScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { activity } = useWallets();

  const tx = activity.find(a => a.id === id) ?? activity[0];

  if (!tx) {
    return (
      <View style={styles.root}>
        <AuroraBackground />
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <ScreenHeader title="Compartir recibo" />
          <View style={styles.emptyWrap}>
            <Text style={type.body}>No se encontró la transacción.</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const isIncoming = tx.kind === 'in';
  const sign = isIncoming ? '+' : '-';
  const reference = `TX-${String(tx.id).padStart(5, '0').slice(-5)}`;
  const categoria = isIncoming ? 'Ingreso' : tx.title;
  const dateLabel = `${tx.bucket.toLowerCase().replace(/^\w/, c => c.toUpperCase())} · ${tx.time}`;
  const amountFormatted = `${sign}$${fmt(Math.abs(tx.amount))}`;

  const receiptText = [
    'SaOT - Recibo de operación',
    `Referencia: ${reference}`,
    `Importe: ${amountFormatted}`,
    `Descripción: ${tx.title}`,
    `Categoría: ${categoria}`,
    `Billetera: ${tx.walletName}`,
    `Fecha: ${dateLabel}`,
    'Estado: Completado',
    'Documento generado por SaOT - saot.app',
  ].join('\n');

  const handleCopiarLink = () => {
    Clipboard.setString(receiptText);
    Alert.alert('Copiado', 'El recibo fue copiado al portapapeles.');
  };

  const handleCompartir = async () => {
    try {
      await Share.share({ message: receiptText, title: `Recibo ${reference}` });
    } catch {
      // usuario canceló
    }
  };

  const handleEmail = async () => {
    try {
      await Share.share({
        message: receiptText,
        title: `Recibo ${reference} - SaOT`,
      });
    } catch {
      // usuario canceló
    }
  };

  const handleMostrarQR = () => {
    Alert.alert('QR', 'Función disponible próximamente.');
  };

  const handleDescargarPDF = () => {
    Alert.alert('PDF', 'La descarga de PDF estará disponible próximamente.');
  };

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScreenHeader title="Compartir recibo" />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Tarjeta del recibo */}
          <View style={styles.receiptCard}>
            {/* Cabecera de la tarjeta */}
            <View style={styles.receiptHeader}>
              <WalletGlyph wallet={tx.wallet} size={36} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.receiptTitle}>SaOT - Recibo de operación</Text>
              </View>
              <Text style={styles.receiptRef}>{reference}</Text>
            </View>

            <View style={styles.divider} />

            {/* Importe */}
            <Text style={styles.importeLabel}>Importe pagado</Text>
            <Text style={[styles.importeAmount, { color: isIncoming ? colors.green : colors.text }]}>
              {amountFormatted}
            </Text>

            <View style={styles.divider} />

            {/* Detalles */}
            <ReceiptRow label="Descripción" value={tx.title} />
            <ReceiptRow label="Categoría"   value={categoria} />
            <ReceiptRow label="Billetera"   value={tx.walletName} />
            <ReceiptRow label="Fecha"       value={dateLabel} />
            <ReceiptRow label="Estado"      value="Completado" noBorder />

            <View style={styles.divider} />
            <Text style={styles.footer}>Documento generado por SaOT · saot.app</Text>
          </View>

          {/* Compartir vía */}
          <Text style={[type.label, { marginTop: spacing.xxl, marginBottom: spacing.md }]}>
            COMPARTIR VÍA
          </Text>
          <View style={styles.shareGrid}>
            <ShareBtn icon="copy"  label="Copiar link" onPress={handleCopiarLink} />
            <ShareBtn icon="share" label="Compartir"   onPress={handleCompartir} />
            <ShareBtn icon="mail"  label="Email"       onPress={handleEmail} />
            <ShareBtn icon="qr"    label="Mostrar QR"  onPress={handleMostrarQR} />
          </View>
        </ScrollView>

        <View style={styles.footerBar}>
          <Pressable style={styles.pdfBtn} onPress={handleDescargarPDF}>
            <Text style={styles.pdfBtnText}>Descargar PDF</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function ReceiptRow({ label, value, noBorder }: { label: string; value: string; noBorder?: boolean }) {
  return (
    <View style={[styles.receiptRow, !noBorder && styles.receiptRowBorder]}>
      <Text style={styles.receiptRowLabel}>{label}</Text>
      <Text style={styles.receiptRowValue}>{value}</Text>
    </View>
  );
}

type IconType = 'copy' | 'share' | 'mail' | 'qr';

function ShareBtn({ icon, label, onPress }: { icon: IconType; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.shareBtn} onPress={onPress}>
      <View style={styles.shareBtnIcon}>
        <ShareIcon type={icon} />
      </View>
      <Text style={styles.shareBtnLabel}>{label}</Text>
    </Pressable>
  );
}

function ShareIcon({ type: t }: { type: IconType }) {
  const props = { fill: 'none' as const, stroke: colors.cyan, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (t === 'copy') return (
    <Svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <Rect x={9} y={9} width={13} height={13} rx={2} />
      <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </Svg>
  );
  if (t === 'share') return (
    <Svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
    </Svg>
  );
  if (t === 'mail') return (
    <Svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <Path d="M22 6l-10 7L2 6" />
    </Svg>
  );
  // qr
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" {...props}>
      <Rect x={3} y={3} width={7} height={7} />
      <Rect x={14} y={3} width={7} height={7} />
      <Rect x={3} y={14} width={7} height={7} />
      <Path d="M14 14h3v3M17 17h3v3M14 20h3" />
    </Svg>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 20 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  receiptCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radii.cardLg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  receiptTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text,
  },
  receiptRef: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.dim,
  },
  divider: {
    height: 1,
    backgroundColor: colors.hairline,
    marginVertical: spacing.md,
  },
  importeLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  importeAmount: {
    fontFamily: fonts.displayBold,
    fontSize: 30,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  receiptRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  receiptRowLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
  },
  receiptRowValue: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.sm,
  },
  footer: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.dim,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  shareGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shareBtn: {
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  shareBtnIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.card,
    backgroundColor: 'rgba(57,195,242,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(57,195,242,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
  },

  footerBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 28,
    paddingTop: spacing.sm,
  },
  pdfBtn: {
    height: 52,
    borderRadius: radii.button,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfBtnText: {
    ...type.button,
    color: colors.ctaText,
  },
});
