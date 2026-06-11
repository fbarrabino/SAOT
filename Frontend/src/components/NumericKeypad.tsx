// Teclado numérico custom — grid 4x3 con teclas surface, punto y ⌫.
// Calca el patrón de `.dkeys` del prototipo (ver saot-demo.js → keypad()).
// El valor se maneja como string para preservar la entrada de "." y ceros
// — usar amountValue() de utils/format para convertirlo a number.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '@/theme/tokens';

type Props = {
  value: string;
  onChange: (next: string) => void;
  maxDigits?: number; // sin contar el punto
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'] as const;

export function NumericKeypad({ value, onChange, maxDigits = 7 }: Props) {
  function press(k: (typeof KEYS)[number]) {
    if (k === 'DEL') {
      onChange(value.slice(0, -1));
      return;
    }
    if (k === '.') {
      if (!value.includes('.') && value.length > 0) onChange(value + '.');
      return;
    }
    if (value.replace('.', '').length >= maxDigits) return;
    onChange(value + k);
  }

  return (
    <View style={styles.grid}>
      {KEYS.map(k => (
        <Pressable
          key={k}
          style={styles.key}
          android_ripple={{ color: 'rgba(255,255,255,0.06)', borderless: false }}
          onPress={() => press(k)}
        >
          {k === 'DEL' ? (
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M22 5H8l-6 7 6 7h14a2 2 0 002-2V7a2 2 0 00-2-2z"
                stroke={colors.text}
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M13 9l5 5M18 9l-5 5"
                stroke={colors.text}
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </Svg>
          ) : (
            <Text style={styles.label}>{k}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 6,
  },
  key: {
    width: '33.333%',
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.text,
    letterSpacing: -0.5,
  },
});
