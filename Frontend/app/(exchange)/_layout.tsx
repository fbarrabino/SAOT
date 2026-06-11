// Stack del flujo Cambiar.
import { Stack } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function ExchangeLayout() {
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
