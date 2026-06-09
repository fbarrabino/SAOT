import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '@/theme/tokens';

export function AuroraBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]} />
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="blue" cx="20%" cy="10%" r="60%">
            <Stop offset="0%" stopColor="#285AA0" stopOpacity="0.55" />
            <Stop offset="65%" stopColor="#285AA0" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="violet" cx="88%" cy="14%" r="55%">
            <Stop offset="0%" stopColor="#7850C8" stopOpacity="0.45" />
            <Stop offset="65%" stopColor="#7850C8" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="lime" cx="80%" cy="46%" r="55%">
            <Stop offset="0%" stopColor="#8CC850" stopOpacity="0.28" />
            <Stop offset="70%" stopColor="#8CC850" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#blue)" />
        <Rect width={width} height={height} fill="url(#violet)" />
        <Rect width={width} height={height} fill="url(#lime)" />
      </Svg>
    </View>
  );
}
