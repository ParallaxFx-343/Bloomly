import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/Colors';
import { kvGetBool } from '../../lib/database';
import { playSound } from '../../lib/sounds';
import { t } from '../../lib/i18n';
import {
  GardenIcon,
  SeedlingIcon,
  CalendarIcon,
  CollectionIcon,
  SettingsIcon,
} from '../../components/Common/Icon';

export default function AppLayout() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const onboarded = await kvGetBool('onboarding_complete');
      if (!onboarded) {
        router.replace('/(onboarding)');
      }
      setChecked(true);
    })();
  }, []);

  if (!checked) return null;

  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          playSound('tap');
        },
      }}
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopColor: colors.border,
          height: 76,
          paddingBottom: 14,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab.garden') as string,
          tabBarIcon: ({ color }) => <GardenIcon size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="entry"
        options={{
          title: t('tab.plant') as string,
          tabBarIcon: ({ color }) => <SeedlingIcon size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('tab.calendar') as string,
          tabBarIcon: ({ color }) => <CalendarIcon size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: t('tab.collection') as string,
          tabBarIcon: ({ color }) => <CollectionIcon size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tab.settings') as string,
          tabBarIcon: ({ color }) => <SettingsIcon size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="paywall"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
