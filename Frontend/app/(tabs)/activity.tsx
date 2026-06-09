import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuroraBackground } from '@/components/AuroraBackground';
import { colors, fonts } from '@/theme/tokens';

export default function Activity() {
  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.body}>
          <Text style={styles.title}>Actividad</Text>
          <Text style={styles.placeholder}>Próximamente en el Bloque 2.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, padding: 18, paddingTop: 18 },
  title: { fontFamily: fonts.displayBold, fontSize: 30, color: colors.text, letterSpacing: -0.5 },
  placeholder: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 8 },
});
