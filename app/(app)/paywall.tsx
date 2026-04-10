import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { usePremium } from '../../contexts/PremiumContext';
import { SparkleIcon, SeedlingIcon, PaletteIcon, MusicIcon, ChartIcon, NoAdsIcon } from '../../components/Common/Icon';
import { PressableSpring } from '../../components/Common/PressableSpring';
import { playSound } from '../../lib/sounds';
import { t } from '../../lib/i18n';

interface Feature {
  icon: React.ReactNode;
  label: string;
  free: string;
  premium: string;
}

function getFeatures(): Feature[] {
  return [
    { icon: <SeedlingIcon size={18} color={Colors.primary} />, label: t('paywall.plants') as string, free: t('paywall.plantsFree') as string, premium: t('paywall.plantsPremium') as string },
    { icon: <PaletteIcon />, label: t('paywall.themes') as string, free: t('paywall.themesFree') as string, premium: t('paywall.themesPremium') as string },
    { icon: <MusicIcon />, label: t('paywall.sounds') as string, free: t('paywall.soundsFree') as string, premium: t('paywall.soundsPremium') as string },
    { icon: <ChartIcon />, label: t('paywall.stats') as string, free: t('paywall.statsFree') as string, premium: t('paywall.statsPremium') as string },
    { icon: <NoAdsIcon />, label: t('paywall.ads') as string, free: t('paywall.adsFree') as string, premium: t('paywall.adsPremium') as string },
  ];
}

export default function PaywallScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { isPremium, packages, purchase, restore } = usePremium();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const yearlyPkg = packages.find((p) => p.packageType === 'ANNUAL');
  const monthlyPkg = packages.find((p) => p.packageType === 'MONTHLY');

  const features = useMemo(() => getFeatures(), []);

  const handlePurchase = async (pkg: typeof yearlyPkg) => {
    if (!pkg) {
      Alert.alert(t('paywall.errorTitle') as string, t('paywall.errorNotAvailable') as string);
      return;
    }
    setPurchasing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playSound('tap');
    try {
      const success = await purchase(pkg);
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        playSound('celebrate');
        router.back();
      }
    } catch (err) {
      Alert.alert(t('paywall.errorTitle') as string, t('paywall.errorPurchase') as string);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const success = await restore();
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(t('paywall.restoreSuccessTitle') as string, t('paywall.restoreSuccessMsg') as string);
        router.back();
      } else {
        Alert.alert(t('paywall.restoreNoneTitle') as string, t('paywall.restoreNoneMsg') as string);
      }
    } catch {
      Alert.alert(t('paywall.errorTitle') as string, t('paywall.errorRestore') as string);
    } finally {
      setRestoring(false);
    }
  };

  // If already premium, show a confirmation
  if (isPremium) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <Text style={{ fontSize: 56, marginBottom: 16 }}>✨</Text>
        <Text style={[styles.title, { color: colors.text }]}>{t('paywall.alreadyPremium') as string}</Text>
        <PressableSpring
          style={[styles.yearlyBtn, { backgroundColor: colors.primary, marginTop: 24 }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.yearlyBtnText, { color: colors.white }]}>{t('paywall.backToGarden') as string}</Text>
        </PressableSpring>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Pressable style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={[styles.closeText, { color: colors.textLight }]}>✕</Text>
      </Pressable>

      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.iconWrap}>
        <SparkleIcon size={56} color={colors.secondary} />
      </Animated.View>
      <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={[styles.title, { color: colors.text }]}>
        {t('paywall.title') as string}
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(300).duration(500)} style={[styles.subtitle, { color: colors.textLight }]}>
        {t('paywall.subtitle') as string}
      </Animated.Text>

      {/* Comparison table — frosted glass */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={[styles.table, { borderColor: colors.border, overflow: 'hidden' }]}>
        <BlurView intensity={60} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
        <View style={[styles.tableHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.tableHeaderText, { flex: 2, color: colors.textLight }]} />
          <Text style={[styles.tableHeaderText, { color: colors.textLight }]}>{t('paywall.free') as string}</Text>
          <Text style={[styles.tableHeaderText, styles.premiumHeader, { color: colors.primary }]}>{t('paywall.premium') as string}</Text>
        </View>
        {features.map((f) => (
          <View key={f.label} style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 2, flexDirection: 'row', gap: 8, alignItems: 'center' }]}>
              {f.icon}
              <Text style={[styles.featureLabel, { color: colors.text }]}>{f.label}</Text>
            </View>
            <Text style={[styles.tableCell, styles.freeText, { color: colors.textLight }]}>{f.free}</Text>
            <Text style={[styles.tableCell, styles.premiumText, { color: colors.primary }]}>{f.premium}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Price buttons */}
      <Animated.View entering={FadeInDown.delay(500).duration(500)} style={{ width: '100%' }}>
        <PressableSpring
          style={[styles.yearlyBtn, { backgroundColor: colors.primary }]}
          disabled={purchasing}
          onPress={() => handlePurchase(yearlyPkg)}
        >
          {purchasing ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={[styles.yearlyBtnText, { color: colors.white }]}>{t('paywall.yearly') as string}</Text>
              <Text style={[styles.yearlySubtext, { color: colors.white }]}>{t('paywall.yearlySave') as string}</Text>
            </>
          )}
        </PressableSpring>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600).duration(500)} style={{ width: '100%' }}>
        <PressableSpring
          style={[styles.monthlyBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          disabled={purchasing}
          onPress={() => handlePurchase(monthlyPkg)}
        >
          <Text style={[styles.monthlyBtnText, { color: colors.text }]}>{t('paywall.monthly') as string}</Text>
        </PressableSpring>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(700).duration(400)}>
        <Pressable onPress={handleRestore} disabled={restoring}>
          <Text style={[styles.restoreText, { color: colors.textLight }]}>
            {restoring ? '...' : t('paywall.restore') as string}
          </Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-start',
    padding: 12,
    marginTop: 8,
  },
  closeText: {
    fontSize: 20,
  },
  iconWrap: {
    marginTop: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  table: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    padding: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  premiumHeader: {},
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  featureLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  freeText: {},
  premiumText: {
    fontWeight: '600',
  },
  yearlyBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  yearlyBtnText: {
    fontSize: 17,
    fontWeight: '600',
  },
  yearlySubtext: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  monthlyBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  monthlyBtnText: {
    fontSize: 15,
    fontWeight: '500',
  },
  restoreText: {
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
