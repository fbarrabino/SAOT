// Stack del flujo Enviar — espejo del (auth) layout.
// Pantallas: recipient → amount → confirm → success.
import { Stack } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function SendLayout() {
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
