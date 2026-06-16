import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing, type } from '@/theme/tokens';

export default function PayQRScanningScreen() {
    // Valor animado para la línea del escáner
    const scanLineY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animación en loop que sube y baja
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineY, {
                    toValue: 240, // baja 240px
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanLineY, {
                    toValue: 0, // vuelve a subir
                    duration: 2000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, [scanLineY]);

    return (
        <View style={styles.container}>
            {/* Simulación del feed de la cámara (fondo oscuro) */}
            <View style={styles.cameraFeed} />

            {/* Cabecera flotante */}
            <View style={styles.header}>
                <Pressable style={styles.iconBtn}>
                    <Feather name="x" size={24} color={colors.text} />
                </Pressable>
                <Text style={styles.title}>Escanear QR</Text>
                <Pressable style={styles.iconBtn}>
                    <Feather name="image" size={20} color={colors.text} />
                </Pressable>
            </View>

            {/* Área central de escaneo */}
            <View style={styles.scanAreaContainer}>
                <View style={styles.scanBox}>
                    {/* Esquinas del marco */}
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />

                    {/* Línea láser animada */}
                    <Animated.View
                        style={[
                            styles.scanLine,
                            { transform: [{ translateY: scanLineY }] }
                        ]}
                    />
                </View>
            </View>

            {/* Pie flotante */}
            <View style={styles.footer}>
                <View style={styles.instructionPill}>
                    <Text style={styles.instructionText}>Enfocá el código QR para pagar</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Fondo negro de cámara
    },
    cameraFeed: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#11141A', // Simula la oscuridad de una cámara activa
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: spacing.lg,
        zIndex: 10,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        ...type.h4,
        fontSize: 18,
    },
    scanAreaContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanBox: {
        width: 240,
        height: 240,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: colors.cyan,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: radii.card,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: radii.card,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: radii.card,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: radii.card,
    },
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: colors.cyan,
        shadowColor: colors.cyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
    footer: {
        paddingBottom: 60,
        alignItems: 'center',
        zIndex: 10,
    },
    instructionPill: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: 999,
    },
    instructionText: {
        ...type.body,
        fontWeight: '500',
    }
});