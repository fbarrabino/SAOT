import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { WalletGlyph } from '@/components/WalletGlyph';
import type { WalletGlyphKey } from '@/components/WalletGlyph';
import { colors, radii, spacing, type, gradients, shadow } from '@/theme/tokens';

const GLYPH_KEYS: WalletGlyphKey[] = ['mp', 'ua', 'lm', 'bb', 'nx'];

export default function ConnectSuccessScreen() {
    // B2 — recibe la billetera elegida en connect-list para que el copy y el
    // logo coincidan con lo que el usuario realmente vinculó.
    const params = useLocalSearchParams<{
        walletGlyph?: string;
        walletName?: string;
        walletShort?: string;
        walletColor?: string;
    }>();
    const walletName = params.walletName ?? 'la billetera';
    const walletShort = params.walletShort ?? '?';
    const walletColor = params.walletColor ?? '#6842FF';
    const walletGlyph = GLYPH_KEYS.includes(params.walletGlyph as WalletGlyphKey)
        ? (params.walletGlyph as WalletGlyphKey)
        : null;

    return (
        <View style={styles.container}>
            <AuroraBackground />

            {/* Botón de cerrar superior */}
            <View style={styles.header}>
                <Pressable style={styles.closeBtn} onPress={() => router.replace('/(tabs)/wallets')}>
                    <Feather name="x" size={24} color={colors.text} />
                </Pressable>
            </View>

            <View style={styles.content}>
                <View style={styles.successCircleOuter}>
                    <View style={styles.successCircleInner}>
                        <Feather name="check" size={32} color="#FFFFFF" />
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={type.display}>{walletName}</Text>
                    <Text style={styles.successLabel}>¡Conectada!</Text>
                    <Text style={styles.subtitle}>
                        Ya podés ver el balance desde tu dashboard.
                    </Text>
                </View>

                <View style={styles.statusCard}>
                    <View style={styles.statusLeft}>
                        {walletGlyph ? (
                            <View style={{ marginRight: spacing.md }}>
                                <WalletGlyph wallet={walletGlyph} size={40} />
                            </View>
                        ) : (
                            <View style={[styles.walletIcon, { backgroundColor: walletColor }]}>
                                <Text style={styles.walletIconText}>{walletShort}</Text>
                            </View>
                        )}
                        <View>
                            <Text style={type.h4}>{walletName}</Text>
                            <Text style={type.small}>Listo para usar</Text>
                        </View>
                    </View>
                    <Text style={styles.activeLabel}>ACTIVA</Text>
                </View>
            </View>

            {/* Footer con botones de acción */}
            <View style={styles.footer}>
                <View style={[shadow.cta, { borderRadius: radii.button, marginBottom: spacing.md }]}>
                    <Pressable 
                        android_ripple={{ color: 'rgba(0,0,0,0.12)' }} 
                        onPress={() => router.replace('/(tabs)/wallets')}
                    >
                        <LinearGradient
                            colors={gradients.cyan}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryBtn}
                        >
                            <Text style={type.button}>Ver mis billeteras</Text>
                        </LinearGradient>
                    </Pressable>
                </View>

                <Pressable style={styles.ghostBtn} onPress={() => router.replace('/connect-list')}>
                    <Text style={[type.button, { color: colors.text }]}>Conectar otra</Text>
                </Pressable>
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
        zIndex: 10,
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
        marginTop: -60,
    },
    successCircleOuter: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(74,222,128,0.15)',
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
        marginBottom: 40,
    },
    successLabel: {
        ...type.display,
        fontSize: 22,
        color: colors.text,
        marginTop: spacing.xs,
        marginBottom: spacing.md,
    },
    subtitle: {
        ...type.body,
        textAlign: 'center',
    },
    statusCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: spacing.lg,
    },
    statusLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    walletIconText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    activeLabel: {
        ...type.label,
        color: colors.green,
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
    },
    ghostBtn: {
        height: 52,
        borderRadius: radii.button,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    }
});