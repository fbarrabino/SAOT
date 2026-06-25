import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { WalletGlyph } from '@/components/WalletGlyph';
import { colors, radii, spacing, type } from '@/theme/tokens';
import { fmt } from '@/utils/format';
import { useWallets } from '@/context/WalletsContext';
import type { WalletKey } from '@/data/wallets';

export default function WalletDetailScreen() {
    // FE-01: pantalla parametrizada por billetera (mp/ua/lm).
    // El gradient, logo y nombre salen del propio Wallet del contexto,
    // así Ualá usa uaTint (violeta) y Lemon lmTint (lima) sin duplicar componentes.
    const { wallet: walletParam } = useLocalSearchParams<{ wallet?: WalletKey }>();
    const { wallets, activity } = useWallets();

    const walletKey: WalletKey = (walletParam ?? 'mp') as WalletKey;
    const wallet = wallets.find((w) => w.key === walletKey) ?? wallets[0];

    if (!wallet) {
        return (
            <View style={styles.container}>
                <AuroraBackground />
                <View style={{ paddingTop: 48 }}>
                    <ScreenHeader title="Billetera" />
                </View>
                <View style={styles.emptyBox}>
                    <Text style={type.body}>No se encontró la billetera.</Text>
                </View>
            </View>
        );
    }

    const walletTransactions = activity.filter((a) => a.wallet === wallet.key);

    return (
        <View style={styles.container}>
            <AuroraBackground />

            <View style={{ paddingTop: 48 }}>
                <ScreenHeader title={wallet.name} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={wallet.tint}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    <View style={styles.cardHeader}>
                        <WalletGlyph wallet={wallet.key} size={48} />
                    </View>

                    <Text style={styles.balanceLabel}>Balance disponible</Text>
                    <Text style={type.balance}>{fmt(wallet.bal)}</Text>

                    <View style={styles.actionsRow}>
                        <ActionButton icon="send" label="Enviar" onPress={() => router.push('/(send)/recipient')} />
                        <ActionButton icon="download" label="Pedir" onPress={() => router.push('/(request)/amount')} />
                        <ActionButton icon="repeat" label="Cambiar" onPress={() => router.push('/(exchange)/amount')} />
                    </View>
                </LinearGradient>

                <View style={styles.transactionsHeader}>
                    <Text style={type.h4}>Transacciones</Text>
                    <Text style={[type.label, { textAlign: 'right', fontSize: 10 }]}>Esta{'\n'}billetera</Text>
                </View>

                <View style={styles.transactionsList}>
                    {walletTransactions.length === 0 ? (
                        <Text style={[type.body, { textAlign: 'center', marginTop: spacing.lg }]}>
                            Sin movimientos en esta billetera.
                        </Text>
                    ) : (
                        walletTransactions.map((tx) => (
                            <Pressable key={tx.id} onPress={() => router.push('/transaction-detail')}>
                                <View style={styles.txRow}>
                                    <View style={styles.txIconContainer}>
                                        <Feather
                                            name={tx.kind === 'in' ? 'arrow-down-left' : 'arrow-up-right'}
                                            size={16}
                                            color={tx.kind === 'in' ? colors.green : colors.text}
                                        />
                                    </View>
                                    <View style={styles.txInfo}>
                                        <Text style={type.bodyText}>{tx.title}</Text>
                                        <Text style={type.small}>{`${tx.bucket} · ${tx.time}`}</Text>
                                    </View>
                                    <Text style={[type.h4, tx.kind === 'in' && { color: colors.green }]}>
                                        {tx.kind === 'in' ? '+' : '-'}
                                        {fmt(Math.abs(tx.amount))}
                                    </Text>
                                </View>
                            </Pressable>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

function ActionButton({ icon, label, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; onPress?: () => void }) {
    return (
        <Pressable style={styles.actionBtn} onPress={onPress}>
            <Feather name={icon} size={14} color={colors.text} style={{ marginRight: spacing.xs }} />
            <Text style={[type.button, { color: colors.text }]}>{label}</Text>
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
    emptyBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
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
