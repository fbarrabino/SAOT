import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuroraBackground } from '@/components/AuroraBackground';
import { colors, radii, spacing, type, gradients, shadow } from '@/theme/tokens';

export default function PayQRSuccessScreen() {
    return (
        <View style={styles.container}>
            <AuroraBackground />

            {/* Botón de cerrar superior */}
            <View style={styles.header}>
                <Pressable style={styles.closeBtn}>
                    <Feather name="x" size={24} color={colors.text} />
                </Pressable>
            </View>

            <View style={styles.content}>
                {/* Animación/Check de Éxito */}
                <View style={styles.successCircleOuter}>
                    <View style={styles.successCircleInner}>
                        <Feather name="check" size={32} color="#FFFFFF" />
                    </View>
                </View>

                {/* Textos arreglados (sin superposición) */}
                <View style={styles.textContainer}>
                    <Text style={styles.successLabel}>Pago</Text>
                    <Text style={styles.successLabel}>aprobado</Text>

                    {/* Subtítulo con margen superior para evitar el error del diseño original */}
                    <Text style={styles.subtitle}>
                        $24.80 pagado a <Text style={{ fontWeight: 'bold', color: colors.text }}>Café Buenos Aires</Text>{'\n'}
                        vía Mercado Pago.
                    </Text>
                </View>
            </View>

            {/* Footer con el CTA Listo */}
            <View style={styles.footer}>
                <View style={[shadow.cta, { borderRadius: radii.button }]}>
                    <Pressable android_ripple={{ color: 'rgba(0,0,0,0.12)' }}>
                        <LinearGradient
                            colors={gradients.cyan}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryBtn}
                        >
                            <Text style={[type.button, { color: '#06121A' }]}>Listo</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: spacing.xl,
        alignItems: 'flex-end',
    },
    closeBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radii.icon,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        marginTop: -60, // Compensa el espacio del header para centrar perfectamente
    },
    successCircleOuter: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(74,222,128,0.15)', // Verde con opacidad
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xxl,
    },
    successCircleInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.green,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    textContainer: {
        alignItems: 'center',
    },
    successLabel: {
        ...type.display,
        fontSize: 32,
        color: colors.text,
        textAlign: 'center',
        lineHeight: 38,
    },
    subtitle: {
        ...type.body,
        textAlign: 'center',
        color: colors.dim,
        marginTop: spacing.xl, // Separación clave aplicada para separar los textos
        lineHeight: 22,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: 40,
    },
    primaryBtn: {
        height: 52,
        borderRadius: radii.button,
        alignItems: 'center',
        justifyContent: 'center',
    }
});