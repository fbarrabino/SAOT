import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radii, spacing, type } from '@/theme/tokens';
import { fmt } from '@/utils/format';

export default function TransactionDetailScreen() {
    const tx = {
        amount: -45.20,
        walletName: 'Mercado Pago',
        date: 'Hoy · 14:22',
        description: 'Supermercado',
        category: 'Supermercado',
        status: 'Completado',
        reference: 'TX-10001'
    };

    return (
        <View style={styles.container}>
            <AuroraBackground />

            <View style={{ paddingTop: 48 }}>
                <ScreenHeader title="Transacción" />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.headerTx}>
                    {/* Logo temporal para no bloquear el desarrollo */}
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>MP</Text>
                    </View>
                    <Text style={styles.subtitle}>Pagado con {tx.walletName}</Text>
                    <Text style={type.balance}>{fmt(tx.amount)}</Text>
                    <Text style={[type.small, { marginTop: spacing.xs }]}>{tx.date}</Text>
                </View>

                <View style={styles.detailsCard}>
                    <DetailRow label="Descripción" value={tx.description} />
                    <DetailRow label="Categoría" value={tx.category} />
                    <DetailRow label="Estado" value={tx.status} />
                    <DetailRow label="Referencia" value={tx.reference} noBorder />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable style={styles.secondaryBtn}>
                    <Text style={[type.button, { color: colors.text }]}>Compartir recibo</Text>
                </Pressable>
                <Pressable style={styles.secondaryBtn}>
                    <Text style={[type.button, { color: colors.text }]}>Reportar problema</Text>
                </Pressable>
            </View>
        </View>
    );
}

function DetailRow({ label, value, noBorder }: { label: string, value: string, noBorder?: boolean }) {
    return (
        <View style={[styles.detailRow, !noBorder && styles.detailRowBorder]}>
            <Text style={type.body}>{label}</Text>
            <Text style={type.bodyText}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },
    headerTx: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    logoText: {
        color: '#00A1EA',
        fontWeight: 'bold',
        fontSize: 24,
    },
    subtitle: {
        ...type.body,
        marginBottom: spacing.sm,
    },
    detailsCard: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        paddingHorizontal: spacing.lg,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.lg,
    },
    detailRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.hairline,
    },
    footer: {
        flexDirection: 'row',
        gap: spacing.sm,
        padding: spacing.lg,
        paddingBottom: 40,
    },
    secondaryBtn: {
        flex: 1,
        height: 52,
        borderRadius: radii.button,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.cardBorder,
    }
});