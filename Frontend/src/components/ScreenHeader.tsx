import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, radii } from '@/theme/tokens';

type Props = {
  title?: string;
  onBack?: () => void;
};

export function ScreenHeader({ title, onBack }: Props) {
  const back = onBack ?? (() => router.back());
  return (
    <View style={styles.row}>
      <Pressable onPress={back} style={styles.btn} hitSlop={8}>
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path
            d="M15 5l-7 7 7 7"
            stroke={colors.text}
            strokeWidth={2.2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: radii.icon,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.text,
  },
});
