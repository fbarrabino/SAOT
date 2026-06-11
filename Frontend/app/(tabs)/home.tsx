import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Svg, { Path, Rect } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { WalletGlyph } from '@/components/WalletGlyph';
import { colors, fonts, gradients, radii, type } from '@/theme/tokens';

const fmt = (n: number) =>
  '$' +
  n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const WALLETS = [
  { key: 'mp' as const, name: 'Mercado Pago', bal: 3200.5, tint: gradients.mpTint },
  { key: 'ua' as const, name: 'Ualá', bal: 1500.0, tint: gradients.uaTint },
  { key: 'lm' as const, name: 'Lemon', bal: 7749.75, tint: gradients.lmTint },
];

const ACTIVITY = [
  { key: 'mp' as const, title: 'Mercado Pago', sub: 'Supermercado', amt: -45.2 },
  { key: 'ua' as const, title: 'Ualá', sub: 'Transferencia recibida', amt: 200.0 },
  { key: 'lm' as const, title: 'Lemon', sub: 'Compra online', amt: -120.5 },
];

function SendIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={colors.cyan} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
      <Path d="M21 3L3 11l7 2 2 7 9-17z" />
      <Path d="M10 13L21 3" />
    </Svg>
  );
}
function RequestIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={colors.cyan} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
      <Path d="M12 4v12" />
      <Path d="M6 11l6 6 6-6" />
      <Path d="M4 20h16" />
    </Svg>
  );
}
function SwapIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={colors.cyan} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
      <Path d="M4 8h13l-3-3" />
      <Path d="M20 16H7l3 3" />
    </Svg>
  );
}
function QRIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={colors.cyan} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
      <Rect x={3} y={3} width={7} height={7} rx={1} />
      <Rect x={14} y={3} width={7} height={7} rx={1} />
      <Rect x={3} y={14} width={7} height={7} rx={1} />
      <Path d="M14 14h3v3M21 14v3M14 18v3h3M18 21h3" />
    </Svg>
  );
}

export default function Home() {
  const total = WALLETS.reduce((s, w) => s + w.bal, 0);

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.balanceLabel}>Balance Total</Text>
          <Text style={styles.balance}>{fmt(total)}</Text>

          <View style={styles.sectionRow}>
            <Text style={styles.h4}>Billeteras Conectadas</Text>
            <Text style={styles.more}>›</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 18, gap: 10 }}
            style={{ marginHorizontal: -18, paddingHorizontal: 18 }}
          >
            {WALLETS.map(w => (
              <LinearGradient
                key={w.key}
                colors={w.tint}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.wcard}
              >
                <WalletGlyph wallet={w.key} size={34} />
                <Text style={styles.wname}>{w.name}</Text>
                <Text style={styles.wbal}>{fmt(w.bal)}</Text>
              </LinearGradient>
            ))}
          </ScrollView>

          <View style={[styles.sectionRow, { marginTop: 24 }]}>
            <Text style={styles.h4}>Acciones Rápidas</Text>
          </View>

          <View style={styles.qa}>
            <QuickAction
              icon={<SendIcon />}
              label="Enviar"
              onPress={() => router.push('/(send)/recipient')}
            />
            <QuickAction
              icon={<RequestIcon />}
              label="Pedir"
              onPress={() => router.push('/(request)/amount')}
            />
            <QuickAction
              icon={<SwapIcon />}
              label="Cambiar"
              onPress={() => router.push('/(exchange)/amount')}
            />
            <QuickAction
              icon={<QRIcon />}
              label="Pagar QR"
              onPress={() => router.push('/(payqr)/scanner')}
            />
          </View>

          <Pressable
            style={[styles.sectionRow, { marginTop: 26 }]}
            onPress={() => router.push('/(tabs)/activity')}
          >
            <Text style={styles.h4}>Actividad Reciente</Text>
            <Text style={styles.more}>Ver todo ›</Text>
          </Pressable>

          {ACTIVITY.map((a, i) => (
            <View key={i} style={styles.act}>
              <WalletGlyph wallet={a.key} size={36} />
              <View style={{ flex: 1, marginLeft: 11 }}>
                <Text style={styles.actTitle}>{a.title}</Text>
                <Text style={styles.actSub}>{a.sub}</Text>
              </View>
              <Text style={[styles.actAmt, { color: a.amt < 0 ? colors.text : colors.green }]}>
                {a.amt < 0 ? '-' : '+'}
                {fmt(Math.abs(a.amt))}
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.qaItem} onPress={onPress}>
      <View style={styles.qaCircle}>{icon}</View>
      <Text style={styles.qaLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 120 },
  balanceLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  balance: {
    fontFamily: fonts.displayBold,
    fontSize: 40,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginTop: 2,
    marginBottom: 6,
    color: colors.cyan,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 12,
  },
  h4: { ...type.h4 },
  more: { fontFamily: fonts.body, fontSize: 13, color: colors.dim },
  wcard: {
    width: 130,
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  wname: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 22 },
  wbal: { fontFamily: fonts.displayBold, fontSize: 15, color: colors.text, marginTop: 2 },
  qa: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  qaItem: { flex: 1, alignItems: 'center', gap: 8 },
  qaCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(57,195,242,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(57,195,242,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaLabel: { fontFamily: fonts.bodySemi, fontSize: 11, color: colors.cyan },
  act: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: colors.hairline,
    borderBottomWidth: 1,
  },
  actTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.text },
  actSub: { fontFamily: fonts.body, fontSize: 11.5, color: colors.dim, marginTop: 2 },
  actAmt: { fontFamily: fonts.displayBold, fontSize: 14 },
});
