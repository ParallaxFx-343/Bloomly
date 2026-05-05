import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { kvGetBool } from '../lib/database';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';
import mobileAds from 'react-native-google-mobile-ads';
import { initSounds, cleanupSounds } from '../lib/sounds';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { PremiumProvider } from '../contexts/PremiumContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function RootLayoutInner() {
  const [isReady, setIsReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const router = useRouter();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    (async () => {
      await initSounds();
      mobileAds().initialize().catch(() => {});
      const done = await kvGetBool('onboarding_complete');
      setOnboarded(done);
      setIsReady(true);
    })();

    return () => { cleanupSounds(); };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (!onboarded) {
      router.replace('/(onboarding)');
    } else {
      router.replace('/(app)');
    }
  }, [isReady, onboarded]);

  if (!isReady) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <StatusBar style={isDark ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PremiumProvider>
        <RootLayoutInner />
      </PremiumProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
