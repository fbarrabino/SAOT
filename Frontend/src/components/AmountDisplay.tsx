// Display grande de monto (centro de las pantallas de Send/Request/Exchange).
// El diseño usa gradiente cian para los montos confirmados; sin masked-view a
// mano lo aproximamos con color sólido del extremo del gradiente — mantiene
// la lectura y el tono sin sumar deps.
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fonts } from '@/theme/tokens';

type Variant = 'plain' | 'cyan' | 'green' | 'mix';

type Props = {
  text: string;
  variant?: Variant;
  size?: number;
};

const VARIANT_COLOR: Record<Variant, string> = {
  plain: colors.text,
  cyan: colors.cyan,
  green: colors.green,
  mix: colors.lime,
};

export function AmountDisplay({ text, variant = 'plain', size = 56 }: Props) {
  return (
    <Text
      style={[
        styles.amt,
        { fontSize: size, color: VARIANT_COLOR[variant] },
      ]}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  amt: {
    fontFamily: fonts.displayBold,
    textAlign: 'center',
    letterSpacing: -1,
  },
});
