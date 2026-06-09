import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts as useSpaceGrotesk, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import {
  useFonts as useJakarta,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme/tokens';

export default function RootLayout() {
  const [grotesk] = useSpaceGrotesk({ SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold });
  const [jakarta] = useJakarta({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!grotesk || !jakarta) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      />
    </SafeAreaProvider>
  );
}
