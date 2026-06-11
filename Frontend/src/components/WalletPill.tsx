// Pill seleccionable para flujos transaccionales (selector de billetera origen / destino).
// Estado activo: borde cian + fondo rgba(57,195,242,.12) — replica `.dpill.on` del prototipo.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WalletGlyph } from './WalletGlyph';
import { colors, fonts } from '@/theme/tokens';
import type { WalletKey } from '@/data/wallets';

type Props = {
  wallet: WalletKey;
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function WalletPill({ wallet, label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, selected && styles.pillOn]}
      hitSlop={4}
    >
      <WalletGlyph wallet={wallet} size={22} />
      <Text style={[styles.text, selected && { color: colors.cyan }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillOn: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(57,195,242,0.12)',
  },
  text: {
    fontFamily: fonts.bodyBold,
    fontSize: 12.5,
    color: colors.text,
  },
});
