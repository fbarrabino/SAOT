import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radii, spacing, type } from '@/theme/tokens';

// Actualizado para sincronizar con los IDs de nuestro WALLET_CATALOG
const AVAILABLE_WALLETS = [
    { id: 'mp', name: 'Mercado Pago', desc: 'Billetera digital · ARG', color: '#009EE3', short: 'MP' },
    { id: 'ua', name: 'Ualá', desc: 'Tarjeta prepaga · ARG', color: '#FF3366', short: 'UA' },
    { id: 'bb', name: 'Brubank', desc: 'Banco digital · ARG', color: '#6842FF', short: 'BB' },
    { id: 'nx', name: 'Naranja X', desc: 'Billetera virtual · ARG', color: '#FF5E00', short: 'NX' },
    { id: 'pp', name: 'Personal Pay', desc: 'Telecom Personal · ARG', color: '#00B4E6', short: 'PP' },
    { id: 'rb', name: 'Reba', desc: 'Cuenta digital · ARG', color: '#00D287', short: 'RB' },
    { id: 'bl', name: 'Belo', desc: 'Wallet · ARG', color: '#6A2BFE', short: 'BL' },
    { id: 'cd', name: 'Cuenta DNI', desc: 'Banco Provincia · ARG', color: '#0055A6', short: 'CD' },
    { id: 'md', name: 'MODO', desc: 'Pagos interbancarios · ARG', color: '#2B1A66', short: 'MD' },
];

export default function ConnectListScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWallets = AVAILABLE_WALLETS.filter((wallet) =>
        wallet.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
        wallet.short.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <AuroraBackground />

            <View style={{ paddingTop: 48 }}>
                <ScreenHeader title="Conectar billetera" />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Text style={styles.description}>
                    Vinculá tu billetera o cuenta digital para ver tu balance y operar desde SaOT.
                    La conexión es segura y podés desconectarla cuando quieras.
                </Text>

                <View style={styles.searchContainer}>
                    <Feather name="search" size={20} color={colors.dim} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar billetera"
                        placeholderTextColor={colors.dim}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <Text style={type.label}>DISPONIBLES</Text>

                <View style={styles.listContainer}>
                    {filteredWallets.length > 0 ? (
                        filteredWallets.map((wallet) => (
                            <ConnectRow
                                key={wallet.id}
                                wallet={wallet}
                                // ACÁ ESTÁ EL FIX: Se pasa el parámetro `wallet` a la siguiente pantalla
                                onPress={() => router.push({ pathname: '/(details)/connect-permissions', params: { wallet: wallet.id } })}
                            />
                        ))
                    ) : (
                        <Text style={styles.noResultsText}>No se encontraron resultados.</Text>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

function ConnectRow({ wallet, onPress }: { wallet: typeof AVAILABLE_WALLETS[0], onPress?: () => void }) {
    return (
        <Pressable style={styles.row} onPress={onPress}>
            <View style={[styles.walletIcon, { backgroundColor: wallet.color }]}>
                <Text style={styles.walletIconText}>{wallet.short}</Text>
            </View>

            <View style={styles.rowInfo}>
                <Text style={type.bodyText}>{wallet.name}</Text>
                <Text style={type.small}>{wallet.desc}</Text>
            </View>

            <Feather name="chevron-right" size={20} color={colors.dim} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: 40,
    },
    description: {
        ...type.small,
        marginBottom: spacing.xl,
        lineHeight: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: radii.input,
        paddingHorizontal: spacing.lg,
        height: 52,
        marginBottom: spacing.xxl,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        fontFamily: 'PlusJakartaSans_500Medium',
        fontSize: 16,
        color: colors.text,
    },
    listContainer: {
        marginTop: spacing.md,
    },
    noResultsText: {
        ...type.body,
        textAlign: 'center',
        marginTop: spacing.xl,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.hairline,
    },
    walletIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    walletIconText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    rowInfo: {
        flex: 1,
    }
});