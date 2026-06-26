import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, fonts } from '@/theme/tokens';
import { metodosPagoApi, type MetodoPagoExterno } from '@/api/metodosPago';

export default function PaymentMethodsScreen() {
    const [methods, setMethods] = useState<MetodoPagoExterno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // MOCK: Replace with global auth context ID once FE-17 is merged
    const USER_ID = 1;

    useEffect(() => {
        loadPaymentMethods();
    }, []);

    const loadPaymentMethods = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await metodosPagoApi.getByUsuario(USER_ID);
            setMethods(data);
        } catch (err: any) {
            setError(err.mensaje || 'Failed to load payment methods.');
        } finally {
            setLoading(false);
        }
    };

    const cards = methods.filter(m => m.tipo.toLowerCase() === 'tarjeta');
    const accounts = methods.filter(m => m.tipo.toLowerCase() === 'cuenta');

    const renderItem = (item: MetodoPagoExterno) => (
        <View key={item.metodoId} style={styles.card}>
            <View style={styles.iconCircle}>
                <Svg width={20} height={20} viewBox="0 0 24 24" stroke={colors.muted} strokeWidth={2} fill="none">
                    {item.tipo.toLowerCase() === 'tarjeta'
                        ? <Path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2zM1 10h22" />
                        : <Path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
                    }
                </Svg>
            </View>
            <View style={styles.itemDetails}>
                <Text style={styles.entity}>{item.entidadEmisora}</Text>
                <Text style={styles.detailText}>{item.tipo} terminada en •••• {item.ultimosCuatro}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.root}>
            <AuroraBackground />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <ScreenHeader title="Métodos de Pago" onBack={() => router.back()} />

                <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        <>
                            {cards.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Tarjetas Vinculadas</Text>
                                    {cards.map(renderItem)}
                                </View>
                            )}

                            {accounts.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Cuentas Vinculadas</Text>
                                    {accounts.map(renderItem)}
                                </View>
                            )}

                            {methods.length === 0 && (
                                <Text style={styles.emptyText}>No tenés métodos de pago vinculados aún.</Text>
                            )}
                        </>
                    )}

                    <Pressable style={styles.addButton} onPress={() => {/* TODO: Navigate to Add Method flow */ }}>
                        <View style={styles.plusCircle}>
                            <Svg width={18} height={18} viewBox="0 0 24 24" stroke={colors.text} strokeWidth={2.2} fill="none">
                                <Path d="M12 5v14M5 12h14" />
                            </Svg>
                        </View>
                        <Text style={styles.addText}>Agregar nuevo método</Text>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    scroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
    loader: { marginTop: 50 },
    section: { marginBottom: 24 },
    sectionTitle: { fontFamily: fonts.bodySemi, fontSize: 13, color: colors.dim, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: colors.cardBorder,
        marginBottom: 10,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemDetails: { flex: 1, marginLeft: 14 },
    entity: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.text },
    detailText: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 4 },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.2)',
        marginTop: 10,
    },
    plusCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addText: { marginLeft: 14, fontFamily: fonts.bodySemi, fontSize: 15, color: colors.text },
    emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 20, marginBottom: 20 },
    errorText: { fontFamily: fonts.body, fontSize: 14, color: colors.red, textAlign: 'center', marginTop: 20 },
});