import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { colors, fonts } from '@/theme/tokens';

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
      <Path d="M3 11l9-8 9 8" />
      <Path d="M5 10v10h14V10" />
    </Svg>
  );
}
function WalletIcon({ color }: { color: string }) {
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
      <Rect x={3} y={6} width={18} height={14} rx={2} />
      <Line x1={3} y1={11} x2={21} y2={11} />
    </Svg>
  );
}
function ActivityIcon({ color }: { color: string }) {
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
      <Path d="M4 12h4l2-7 4 14 2-7h4" />
    </Svg>
  );
}
function ProfileIcon({ color }: { color: string }) {
  return (
    <Svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </Svg>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarActiveTintColor: colors.cyan,
        tabBarInactiveTintColor: colors.dim,
        tabBarLabelStyle: { fontFamily: fonts.bodySemi, fontSize: 10.5 },
        tabBarStyle: styles.bar,
        tabBarBackground: () => <View style={styles.bg} />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Inicio', tabBarIcon: ({ color }) => <HomeIcon color={color} /> }}
      />
      <Tabs.Screen
        name="wallets"
        options={{ title: 'Billeteras', tabBarIcon: ({ color }) => <WalletIcon color={color} /> }}
      />
      <Tabs.Screen
        name="activity"
        options={{ title: 'Actividad', tabBarIcon: ({ color }) => <ActivityIcon color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: ({ color }) => <ProfileIcon color={color} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    borderTopColor: colors.hairline,
    borderTopWidth: 1,
    height: 82,
    paddingTop: 10,
    paddingBottom: 22,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  bg: {
    flex: 1,
    backgroundColor: 'rgba(8,10,13,0.72)',
  },
});
