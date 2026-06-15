import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radii, spacing, type } from '@/theme/tokens';

// Mock de las billeteras basado en el diseño
const AVAILABLE_WALLETS = [
    { id: 'bb', name: 'Brubank', desc: 'Banco digital · ARG', color: '#6842FF', short: 'BB' },
    { id: 'nx', name: 'Naranja X', desc: 'Billetera virtual · ARG', color: '#FF5C00', short: 'NX' },
    { id: 'rb', name: 'Reba', desc: 'Cuenta digital · ARG', color: '#00D1A3', short: 'RB' },
    { id: 'bl', name: 'Belo', desc: 'Wallet · ARG', color: '#4B36FF', short: 'BL' },
    { id: 'cd', name: 'Cuenta DNI', desc: 'Banco Provincia · ARG', color: '#FFB800', short: 'CD' },
    { id: 'md', name: 'MODO', desc: 'Pagos interbancarios · ARG', color: '#4444FF', short: 'M' },
    { id: 'pp', name: 'Personal Pay', desc: 'Telecom Personal · ARG', color: '#FF0055', short: 'PP' },
    { id: 'px', name: 'Prex', desc: 'Tarjeta prepaga · ARG', color: '#00C48C', short: 'PX' },
];

export default function ConnectListScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    // Lógica de filtrado corregida: ahora solo busca al inicio de la palabra (.startsWith)
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
                            <ConnectRow key={wallet.id} wallet={wallet} />
                        ))
                    ) : (
                        <Text style={styles.noResultsText}>No se encontraron resultados.</Text>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

function ConnectRow({ wallet }: { wallet: typeof AVAILABLE_WALLETS[0] }) {
    return (
        <Pressable style={styles.row}>
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