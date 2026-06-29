// FE-04 — Estado intermedio entre "Conceder permisos" y "Conectada".
// Muestra "Sincronizando..." con spinner mientras simulamos el primer
// snapshot de saldo/historial de la billetera externa; al cabo de un
// tiempo corto navega a /connect-success con la wallet ya en estado ACTIVA.
//
// Por ahora la sincronización es un timeout; cuando exista la integración
// real con el proveedor (FE-08+) acá se va a esperar a que el polling de
// /api/cuentas-billetera/me devuelva la nueva cuenta vinculada.
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { colors, radii, spacing, type } from '@/theme/tokens';

const SYNC_DURATION_MS = 2200;

export default function ConnectSyncingScreen() {
    // B2 — la pantalla recibe la wallet elegida y pasa los mismos params a
    // connect-success cuando termina la sincronización simulada.
    const params = useLocalSearchParams<{
        walletId?: string;
        walletName?: string;
        walletShort?: string;
        walletColor?: string;
    }>();
    const walletName = params.walletName ?? 'la billetera';
    const walletShort = params.walletShort ?? '?';
    const walletColor = params.walletColor ?? '#6842FF';

    useEffect(() => {
        const t = setTimeout(() => {
            router.replace({
                pathname: '/connect-success',
                params: {
                    walletId: params.walletId ?? '',
                    walletName,
                    walletShort,
                    walletColor,
                },
            });
        }, SYNC_DURATION_MS);
        return () => clearTimeout(t);
    }, [params.walletId, walletName, walletShort, walletColor]);

    return (
        <View style={styles.container}>
            <AuroraBackground />

            <View style={styles.header}>
                <Pressable style={styles.closeBtn} onPress={() => router.replace('/(tabs)/wallets')}>
                    <Feather name="x" size={24} color={colors.text} />
                </Pressable>
            </View>

            <View style={styles.content}>
                <View style={styles.syncCircleOuter}>
                    <View style={styles.syncCircleInner}>
                        <ActivityIndicator color="#FFFFFF" size="large" />
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={type.display}>{walletName}</Text>
                    <Text style={styles.syncLabel}>Sincronizando…</Text>
                    <Text style={styles.subtitle}>
                        Estamos recibiendo el balance y los últimos movimientos.
                    </Text>
                </View>

                <View style={styles.statusCard}>
                    <View style={styles.statusLeft}>
                        <View style={[styles.walletIcon, { backgroundColor: walletColor }]}>
                            <Text style={styles.walletIconText}>{walletShort}</Text>
                        </View>
                        <View>
                            <Text style={type.h4}>{walletName}</Text>
                            <Text style={type.small}>Recibiendo datos…</Text>
                        </View>
                    </View>
                    <ActivityIndicator color={colors.cyan} size="small" />
                </View>
            </View>

            <View style={styles.footerNote}>
                <Feather name="lock" size={14} color={colors.dim} />
                <Text style={styles.securityText}>
                    Conexión cifrada · OAuth 2.0
                </Text>
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
    syncCircleOuter: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(57,195,242,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xxl,
    },
    syncCircleInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.cyan,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.cyan,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    syncLabel: {
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
    footerNote: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
        paddingBottom: 40,
    },
    securityText: {
        ...type.small,
        fontSize: 11,
    },
});
