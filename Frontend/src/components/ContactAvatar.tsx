// Avatar circular de inicial — usado en la lista/grid de contactos del flujo Enviar.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fonts } from '@/theme/tokens';

type Props = {
  initials: string;
  color: string;
  size?: number;
};

export function ContactAvatar({ initials, color, size = 44 }: Props) {
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.34 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
  text: { fontFamily: fonts.bodyBold, color: '#FFFFFF', letterSpacing: 0.3 },
});
