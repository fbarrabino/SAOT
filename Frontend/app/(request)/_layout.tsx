// Stack del flujo Pedir.
import { Stack } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function RequestLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    />
  );
}
