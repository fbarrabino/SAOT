import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radii, spacing, type, gradients } from '@/theme/tokens';
import { fmt } from '@/utils/format';

export default function WalletDetailScreen() {
    const balance = 3200.50;

    const mockTransactions = [
        { id: '1', title: 'Supermercado', date: 'Hoy · 14:22', amount: -45.20 },
        { id: '2', title: 'Café', date: 'Ayer · 09:12', amount: -6.80 },
    ];

    return (
        <View style={styles.container}>
            <AuroraBackground />

            <View style={{ paddingTop: 48 }}>
                <ScreenHeader title="Mercado Pago" />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={gradients.mpTint}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={styles.cardHeader}>
                        <Image
                            source={require('@/assets/wallets/logo-mp.png')}
                            style={styles.logo}
                        />
                    </View>

                    <Text style={styles.balanceLabel}>Balance disponible</Text>
                    <Text style={type.balance}>{fmt(balance)}</Text>

                    <View style={styles.actionsRow}>
                        <ActionButton icon="send" label="Enviar" />
                        <ActionButton icon="download" label="Pedir" />
                        <ActionButton icon="repeat" label="Cambiar" />
                    </View>
                </LinearGradient>

                <View style={styles.transactionsHeader}>
                    <Text style={type.h4}>Transacciones</Text>
                    <Text style={[type.label, { textAlign: 'right', fontSize: 10 }]}>Esta{'\n'}billetera</Text>
                </View>

                <View style={styles.transactionsList}>
                    {mockTransactions.map((tx) => (
                        <View key={tx.id} style={styles.txRow}>
                            <View style={styles.txIconContainer}>
                                <Feather name="arrow-up-right" size={16} color={colors.text} />
                            </View>
                            <View style={styles.txInfo}>
                                <Text style={type.bodyText}>{tx.title}</Text>
                                <Text style={type.small}>{tx.date}</Text>
                            </View>
                            <Text style={type.h4}>{fmt(tx.amount)}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function ActionButton({ icon, label }: { icon: keyof typeof Feather.glyphMap; label: string }) {
    return (
        <Pressable style={styles.actionBtn}>
            <Feather name={icon} size={14} color={colors.text} style={{ marginRight: spacing.xs }} />
            <Text style={type.button}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 40,
    },
    card: {
        borderRadius: radii.cardLg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: spacing.xl,
        marginBottom: spacing.xxl,
    },
    cardHeader: {
        marginBottom: spacing.lg,
    },
    logo: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceLabel: {
        ...type.body,
        marginBottom: spacing.xs,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xl,
        gap: spacing.sm,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderRadius: radii.button,
    },
    transactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: spacing.lg,
    },
    transactionsList: {
        gap: spacing.lg,
    },
    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txIconContainer: {
        width: 40,
        height: 40,
        borderRadius: radii.icon,
        backgroundColor: colors.surface2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    txInfo: {
        flex: 1,
    },
});