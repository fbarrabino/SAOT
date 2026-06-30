import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuroraBackground } from '@/components/AuroraBackground';
import { colors, fonts } from '@/theme/tokens';

const FAQS = [
    { id: '1', question: '¿Cómo conecto una billetera nueva?' },
    { id: '2', question: '¿Qué pasa si pierdo mi teléfono?' },
    { id: '3', question: '¿Cuánto demora una transferencia?' },
    { id: '4', question: '¿Cobran comisiones?' },
    { id: '5', question: '¿Cómo cambio mi email o contraseña?' },
    { id: '6', question: '¿Mis datos están seguros?' },
];

export default function SupportFaqScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={styles.root}>
            <AuroraBackground />
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Ayuda y soporte</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Buscador */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={colors.dim} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar en la ayuda"
                            placeholderTextColor={colors.dim}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCorrect={false}
                        />
                    </View>

                    {/* Título de sección */}
                    <Text style={styles.sectionTitle}>PREGUNTAS FRECUENTES</Text>

                    {/* Lista de FAQs sin acordeón */}
                    <View style={styles.faqList}>
                        {FAQS.map((faq, index) => (
                            <TouchableOpacity
                                key={faq.id}
                                style={[
                                    styles.faqRow,
                                    index === FAQS.length - 1 && styles.faqRowLast
                                ]}
                            >
                                <Text style={styles.faqText}>{faq.question}</Text>
                                <Ionicons name="chevron-forward" size={16} color={colors.dim} />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Tarjetas de acción */}
                    <View style={styles.actionCardsRow}>
                        {/* Contactar Soporte -> Lleva a la pantalla de formulario de Lautaro */}
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => router.push('/support-contact')}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(57,195,242,0.1)' }]}>
                                <Ionicons name="paper-plane" size={18} color={colors.cyan} />
                            </View>
                            <Text style={styles.actionTitle}>Contactar soporte</Text>
                            <Text style={styles.actionSub}>Te respondemos en 24h</Text>
                        </TouchableOpacity>

                        {/* Chat en vivo */}
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => alert('Chat en vivo no disponible por el momento.')}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(182,240,75,0.1)' }]}>
                                <Ionicons name="help-buoy" size={18} color={colors.lime} />
                            </View>
                            <Text style={styles.actionTitle}>Chat en vivo</Text>
                            <Text style={styles.actionSub}>L-V - 9 a 18hs</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginTop: Platform.OS === 'android' ? 10 : 0,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: fonts.displayBold,
        color: colors.text,
    },
    headerSpacer: {
        width: 44,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 48,
        marginBottom: 24,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        fontFamily: fonts.body,
        color: colors.text,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: fonts.bodyBold,
        color: colors.dim,
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    faqList: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        overflow: 'hidden',
        marginBottom: 24,
    },
    faqRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.hairline,
    },
    faqRowLast: {
        borderBottomWidth: 0,
    },
    faqText: {
        fontSize: 14.5,
        fontFamily: fonts.bodyBold,
        color: colors.text,
        flex: 1,
        paddingRight: 16,
    },
    actionCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionCard: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderRadius: 16,
        padding: 16,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 14,
        fontFamily: fonts.bodyBold,
        color: colors.text,
        marginBottom: 4,
    },
    actionSub: {
        fontSize: 11.5,
        fontFamily: fonts.body,
        color: colors.dim,
    },
});