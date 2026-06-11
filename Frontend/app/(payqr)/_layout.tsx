// Stack del flujo Pagar QR.
// Por ahora solo expone una pantalla "scanner" como placeholder; el flujo
// completo (cámara → confirmar → éxito) pertenece al Bloque 3.
import { Stack } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function PayQRLayout() {
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
