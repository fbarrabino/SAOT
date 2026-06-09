import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

type Key = 'mp' | 'ua' | 'lm';

const LOGOS: Record<Key, ImageSourcePropType> = {
  mp: require('../assets/wallets/mplogo.webp'),
  ua: require('../assets/wallets/logouala.webp'),
  lm: require('../assets/wallets/logolm.webp'),
};

type Props = {
  wallet: Key;
  size?: number;
};

export function WalletGlyph({ wallet, size = 34 }: Props) {
  const isLemon = wallet === 'lm';
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isLemon ? 'transparent' : '#FFFFFF',
        },
      ]}
    >
      <Image
        source={LOGOS[wallet]}
        style={
          isLemon
            ? { width: size, height: size }
            : { width: size * 0.82, height: size * 0.82 }
        }
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
