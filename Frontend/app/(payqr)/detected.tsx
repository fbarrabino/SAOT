import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuroraBackground } from '@/components/AuroraBackground';
import { colors, radii, spacing, type, gradients, shadow } from '@/theme/tokens';

export default function PayQRDetectedScreen() {
    return (
        <View style={styles.container}>
            <AuroraBackground />

            {/* Cabecera */}
            <View style={styles.header}>
                <Pressable style={styles.iconBtn}>
                    <Feather name="chevron-left" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.title}>Código detectado</Text>
                <Pressable style={styles.iconBtn}>
                    <Feather name="x" size={24} color={colors.text} />
                </Pressable>
            </View>

            <View style={styles.content}>
                {/* Tarjeta del Comercio */}
                <View style={styles.merchantCard}>
                    <View style={styles.merchantIconBox}>
                        <Feather name="grid" size={20} color={colors.cyan} />
                    </View>
                    <View style={styles.merchantInfo}>
                        <Text style={[type.small, { marginBottom: 2 }]}>Pagar a</Text>
                        <Text style={type.bodyText}>Café Buenos Aires</Text>
                        <Text style={[type.small, { color: colors.dim, marginTop: 2 }]}>
                            Comercio verificado · Palermo
                        </Text>
                    </View>
                </View>

                {/* Monto a cobrar */}
                <View style={styles.amountContainer}>
                    <Text style={type.small}>Cobro</Text>
                    <Text style={[type.display, { color: colors.green, fontSize: 40, marginTop: spacing.xs }]}>
                        $24.80
                    </Text>
                </View>

                {/* Detalles del pago */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={type.body}>Desde</Text>
                        <View style={styles.walletBadge}>
                            <Image
                                source={require('@/assets/wallets/logo-mp.png')}
                                style={styles.walletLogo}
                            />
                            <Text style={type.bodyText}>Mercado Pago</Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={type.body}>Referencia</Text>
                        <Text style={type.bodyText}>ORD-44821</Text>
                    </View>
                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                        <Text style={type.body}>Comisión</Text>
                        <Text style={type.bodyText}>$0.00</Text>
                    </View>
                </View>
            </View>

            {/* Footer con el CTA */}
            <View style={styles.footer}>
                <View style={[shadow.cta, { borderRadius: radii.button }]}>
                    <Pressable android_ripple={{ color: 'rgba(0,0,0,0.12)' }}>
                        <LinearGradient
                            colors={gradients.cyan}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryBtn}
                        >
                            <Text style={[type.button, { color: '#06121A' }]}>Pagar $24.80</Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: spacing.lg,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        ...type.h4,
        fontSize: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxl,
    },
    merchantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderRadius: radii.card,
        padding: spacing.lg,
        marginBottom: spacing.xxl,
    },
    merchantIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(57,195,242,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    merchantInfo: {
        flex: 1,
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    detailsContainer: {
        marginTop: spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.hairline,
    },
    walletBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        borderRadius: 999,
    },
    walletLogo: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 6,
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