import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuroraBackground } from '@/components/AuroraBackground';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, radii, spacing, type, gradients, shadow } from '@/theme/tokens';

export default function ConnectPermissionsScreen() {
    // Estados para los switches (los dos primeros prendidos por defecto según diseño)
    const [balanceEnabled, setBalanceEnabled] = useState(true);
    const [historyEnabled, setHistoryEnabled] = useState(true);
    const [operateEnabled, setOperateEnabled] = useState(false);

    return (
        <View style={styles.container}>
            <AuroraBackground />

            <View style={{ paddingTop: 48 }}>
                <ScreenHeader title="Permisos" />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Cabecera con logos conectados */}
                <View style={styles.logosRow}>
                    <View style={[styles.logoCircle, { backgroundColor: colors.teal }]}>
                        <Text style={[styles.logoText, { color: colors.bg }]}>S</Text>
                    </View>

                    {/* Puntitos conectores */}
                    <View style={styles.connectorContainer}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>

                    <View style={[styles.logoCircle, { backgroundColor: '#6842FF' }]}>
                        <Text style={styles.logoText}>BB</Text>
                    </View>
                </View>

                {/* Títulos */}
                <Text style={styles.title}>SaOT quiere conectarse con Brubank</Text>
                <Text style={styles.subtitle}>
                    Vamos a recibir los datos que vos elijas. Podés revocar el acceso desde Perfil → Seguridad.
                </Text>

                {/* Tarjeta de Permisos */}
                <View style={styles.permissionsCard}>
                    <PermissionRow
                        icon="credit-card"
                        label="Ver balance disponible"
                        value={balanceEnabled}
                        onValueChange={setBalanceEnabled}
                    />
                    <PermissionRow
                        icon="activity"
                        label="Ver historial de transacciones"
                        value={historyEnabled}
                        onValueChange={setHistoryEnabled}
                    />
                    <PermissionRow
                        icon="send"
                        label="Operar (enviar y pagar)"
                        value={operateEnabled}
                        onValueChange={setOperateEnabled}
                        noBorder
                    />
                </View>

                {/* Nota de seguridad inferior */}
                <View style={styles.securityNote}>
                    <Feather name="lock" size={14} color={colors.dim} />
                    <Text style={styles.securityText}>
                        Conexión cifrada · OAuth 2.0 · No guardamos tu contraseña
                    </Text>
                </View>

            </ScrollView>

            {/* Footer con el CTA */}
            <View style={styles.footer}>
                <View style={[shadow.cta, { borderRadius: radii.button, flex: 1 }]}>
                    <Pressable android_ripple={{ color: 'rgba(0,0,0,0.12)' }}>
                        <LinearGradient
                            colors={gradients.cyan}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryBtn}
                        >
                            <Text style={type.button}>Conectar Brubank</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

// Sub-componente para cada fila de permiso con su Switch
function PermissionRow({ icon, label, value, onValueChange, noBorder }: any) {
    return (
        <View style={[styles.permissionRow, !noBorder && styles.permissionRowBorder]}>
            <View style={styles.permissionLeft}>
                <View style={styles.iconBox}>
                    <Feather name={icon} size={18} color={colors.cyan} />
                </View>
                <Text style={type.bodyText}>{label}</Text>
            </View>
            <Switch
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.cyan }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="rgba(255,255,255,0.1)"
                onValueChange={onValueChange}
                value={value}
            />
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
        paddingTop: spacing.lg,
        paddingBottom: 40,
    },
    logosRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontFamily: 'SpaceGrotesk_700Bold',
        fontSize: 22,
        color: '#FFFFFF',
    },
    connectorContainer: {
        flexDirection: 'row',
        gap: 6,
        marginHorizontal: spacing.md,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.dim,
    },
    title: {
        ...type.h4,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...type.small,
        textAlign: 'center',
        marginBottom: spacing.xxl,
        paddingHorizontal: spacing.md,
    },
    permissionsCard: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    permissionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.lg,
    },
    permissionRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.hairline,
    },
    permissionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'rgba(57,195,242,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    securityNote: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    securityText: {
        ...type.small,
        fontSize: 11,
    },
    footer: {
        padding: spacing.lg,
        paddingBottom: 40,
    },
    primaryBtn: {
        height: 52,
        borderRadius: radii.button,
        alignItems: 'center',
        justifyContent: 'center',
    }
});