import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

type Key = 'mp' | 'ua' | 'lm';

const STYLE: Record<Key, { bg: string; fg: string; letter: string }> = {
  mp: { bg: '#FFFFFF', fg: '#00B0E5', letter: 'MP' },
  ua: { bg: '#FFFFFF', fg: '#7B61FF', letter: 'U' },
  lm: { bg: '#0A1A2E', fg: '#B6F04B', letter: 'L' },
};

type Props = {
  wallet: Key;
  size?: number;
};

export function WalletGlyph({ wallet, size = 34 }: Props) {
  const s = STYLE[wallet];
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: s.bg },
      ]}
    >
      <Text style={[styles.letter, { color: s.fg, fontSize: size * 0.42 }]}>{s.letter}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
  letter: { fontFamily: fonts.displayBold, letterSpacing: -0.5 },
});
