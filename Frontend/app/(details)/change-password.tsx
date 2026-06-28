import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '@/theme/tokens';

export default function ChangePasswordScreen() {
  const router = useRouter();

  // Estados de los inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para mostrar/ocultar contraseñas
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validaciones de QA
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Campos incompletos', 'Por favor, completá todas las contraseñas.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert('Atención', 'La nueva contraseña no puede ser igual a la actual.');
      return;
    }

    setIsLoading(true);

    try {
      // MOCK: Simulamos que le pegamos al backend (BE-11) y tarda 1 segundo.
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert('¡Éxito!', 'Tu contraseña fue actualizada correctamente.', [
        { text: 'OK', onPress: () => router.back() }
      ]);

    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar la contraseña. Intentá más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header con botón volver */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cambiar contraseña</Text>
          <View style={{ width: 24 }} /> {/* Espaciador para centrar el título */}
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>

          {/* Contraseña Actual */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña actual</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Ingresá tu contraseña actual"
                placeholderTextColor={colors.dim}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eyeIcon}>
                <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={20} color={colors.dim} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nueva Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nueva contraseña</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Ingresá tu nueva contraseña"
                placeholderTextColor={colors.dim}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeIcon}>
                <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={20} color={colors.dim} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmar Nueva Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repetir nueva contraseña</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repetí tu nueva contraseña"
                placeholderTextColor={colors.dim}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeIcon}>
                <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color={colors.dim} />
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* Botón de Guardar */}
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Guardando...' : 'Cambiar contraseña'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.displayBold,
    color: colors.text,
  },
  formContainer: {
    flex: 1,
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontFamily: fonts.bodyBold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    fontFamily: fonts.body,
  },
  eyeIcon: {
    padding: 14,
  },
  button: {
    backgroundColor: colors.cyan,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: `${colors.cyan}80`, // Transparencia cuando está deshabilitado
  },
  buttonText: {
    color: colors.bg,
    fontSize: 16,
    fontFamily: fonts.bodyBold,
  },
});