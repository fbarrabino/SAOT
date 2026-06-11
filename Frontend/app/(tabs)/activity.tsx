// Tab Actividad - Bloque 2 #01
// Lista unificada (todas las billeteras) de movimientos en una timeline.
// Header titulo + icono lupa, filtros pill (Todos / Ingresos / Salientes),
// filas agrupadas por bucket temporal (HOY / AYER / fechas).
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { AuroraBackground } from '@/components/AuroraBackground';
import { WalletGlyph } from '@/components/WalletGlyph';
import { ACTIVITY, type ActivityItem } from '@/data/activity';
import { fmt } from '@/utils/format';
import { colors, fonts, radii } from '@/theme/tokens';

type Filter = 'all' | 'in' | 'out';

function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={colors.muted} strokeWidth={2} />
      <Path d="M20 20l-3.5-3.5" stroke={colors.muted} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function Activity() {
  const [filter, setFilter] = useState<Filter>('all');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return ACTIVITY.filter(a => {
      if (filter === 'in' && a.kind !== 'in') return false;
      if (filter === 'out' && a.kind !== 'out') return false;
      if (query) {
        const q = query.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.walletName.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [filter, query]);

  // Re-group por bucket conservando el orden original.
  const grouped: Array<{ bucket: string; items: ActivityItem[] }> = [];
  for (const a of filtered) {
    const last = grouped[grouped.length - 1];
    if (last && last.bucket === a.bucket) last.items.push(a);
    else grouped.push({ bucket: a.bucket, items: [a] });
  }

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.head}>
          <Text style={styles.h1}>Actividad</Text>
          <Pressable
            style={styles.searchBtn}
            onPress={() => setSearching(s => !s)}
            hitSlop={8}
          >
            <SearchIcon />
          </Pressable>
        </View>

        {searching ? (
          <View style={styles.searchWrap}>
            <SearchIcon />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar movimiento, billetera..."
              placeholderTextColor={colors.dim}
              style={styles.searchInput}
            />
          </View>
        ) : null}

        <View style={styles.filters}>
          <FilterPill label="Todos" active={filter === 'all'} onPress={() => setFilter('all')} />
          <FilterPill label="Ingresos" active={filter === 'in'} onPress={() => setFilter('in')} />
          <FilterPill label="Salientes" active={filter === 'out'} onPress={() => setFilter('out')} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {grouped.length === 0 ? (
            <Text style={styles.empty}>Sin movimientos para este filtro.</Text>
          ) : (
            grouped.map(g => (
              <View key={g.bucket}>
                <Text style={styles.bucket}>{g.bucket}</Text>
                {g.items.map(a => (
                  <View key={a.id} style={styles.row}>
                    <WalletGlyph wallet={a.wallet} size={36} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.title}>{a.title}</Text>
                      <Text style={styles.sub}>
                        {a.walletName} - {a.time}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.amount,
                        { color: a.kind === 'in' ? colors.green : colors.text },
                      ]}
                    >
                      {a.kind === 'in' ? '+' : '-'}
                      {fmt(Math.abs(a.amount))}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillOn]}>
      <Text style={[styles.pillText, active && { color: colors.ctaText }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  h1: { fontFamily: fonts.displayBold, fontSize: 28, color: colors.text, letterSpacing: -0.5 },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: radii.icon,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.input,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 4,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    marginTop: 14,
    marginBottom: 6,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pillOn: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  pillText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.text },
  scroll: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 130 },
  bucket: {
    fontFamily: fonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 1.2,
    color: colors.dim,
    marginTop: 14,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.text },
  sub: { fontFamily: fonts.body, fontSize: 11.5, color: colors.dim, marginTop: 2 },
  amount: { fontFamily: fonts.displayBold, fontSize: 14.5 },
  empty: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.dim,
    textAlign: 'center',
    marginTop: 40,
  },
});
