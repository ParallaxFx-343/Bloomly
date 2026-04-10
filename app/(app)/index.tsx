import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  Alert,
} from 'react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  FadeOut,
} from 'react-native-reanimated';
import { useFocusEffect, useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/Colors';
import { getAllPlants, getCurrentStreak, getEntryByDate, PlantRow, kvGetBool, kvSetBool } from '../../lib/database';
import { getPlantStage } from '../../constants/Plants';
import { AnimatedPlant } from '../../components/Garden/AnimatedPlant';
import { GardenParticles } from '../../components/Garden/GardenParticles';
import { SkyBackground } from '../../components/Garden/SkyBackground';
import { RainEffect } from '../../components/Garden/RainEffect';
import { SoundOnIcon, SoundOffIcon, StreakIcon, ShareIcon, GiftIcon } from '../../components/Common/Icon';
import { EmptyGarden } from '../../components/Garden/EmptyGarden';
import { PlantCardSkeleton } from '../../components/Common/Shimmer';
import { PressableSpring } from '../../components/Common/PressableSpring';
import { playAmbientForPeriod, stopAmbient, isAmbientPlaying, playSound } from '../../lib/sounds';
import { getTodayStr } from '../../lib/utils';
import { t } from '../../lib/i18n';
import { usePremium } from '../../contexts/PremiumContext';
import { showRewardedAd, hasClaimedAdRewardToday } from '../../lib/ads';

const MILESTONES: Record<number, { emoji: string; messageKey: string }> = {
  7: { emoji: '\uD83D\uDD25', messageKey: 'milestone.7' },
  14: { emoji: '\uD83C\uDF1F', messageKey: 'milestone.14' },
  30: { emoji: '\uD83D\uDC51', messageKey: 'milestone.30' },
  60: { emoji: '\uD83D\uDC8E', messageKey: 'milestone.60' },
  100: { emoji: '\uD83C\uDFC6', messageKey: 'milestone.100' },
};


export default function GardenScreen() {
  const { colors, isDark, timePeriod } = useTheme();
  const { isPremium } = usePremium();
  const [plants, setPlants] = useState<PlantRow[]>([]);
  const [streak, setStreak] = useState(0);
  const [hasEntryToday, setHasEntryToday] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [milestoneInfo, setMilestoneInfo] = useState<{ emoji: string; messageKey: string } | null>(null);
  const [adRewardClaimed, setAdRewardClaimed] = useState(true); // hide until checked
  const confettiRef = useRef<ConfettiCannon | null>(null);
  const milestoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gardenRef = useRef<View>(null);
  const router = useRouter();
  const isFocused = useIsFocused();

  const loadData = useCallback(async () => {
    try {
      const [allPlants, currentStreak, todayEntry, adClaimed] = await Promise.all([
        getAllPlants(),
        getCurrentStreak(),
        getEntryByDate(getTodayStr()),
        hasClaimedAdRewardToday(),
      ]);
      setPlants(allPlants);
      setStreak(currentStreak);
      setHasEntryToday(!!todayEntry);
      setAdRewardClaimed(adClaimed);

      // Check streak milestones
      const milestone = MILESTONES[currentStreak];
      if (milestone) {
        const alreadyCelebrated = await kvGetBool(`milestone_${currentStreak}`);
        if (!alreadyCelebrated) {
          await kvSetBool(`milestone_${currentStreak}`, true);
          setMilestoneInfo(milestone);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          playSound('celebrate');
          if (milestoneTimer.current) clearTimeout(milestoneTimer.current);
          milestoneTimer.current = setTimeout(() => setMilestoneInfo(null), 3000);
        }
      }
    } catch (err) {
      console.warn('Failed to load garden data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
      // Auto-play ambient matching current time period
      if (!isAmbientPlaying()) {
        playAmbientForPeriod(timePeriod)
          .then(() => setAmbientOn(true))
          .catch(() => {});
      }
      return () => {
        if (milestoneTimer.current) clearTimeout(milestoneTimer.current);
      };
    }, [loadData, timePeriod])
  );

  // When timePeriod changes (every 60s check), transition ambient sound
  useEffect(() => {
    if (ambientOn && isFocused) {
      playAmbientForPeriod(timePeriod).catch(() => {});
    }
  }, [timePeriod, ambientOn, isFocused]);

  const toggleAmbient = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playSound('tap');
    if (ambientOn) {
      await stopAmbient();
      setAmbientOn(false);
    } else {
      await playAmbientForPeriod(timePeriod);
      setAmbientOn(true);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const shareGarden = async () => {
    if (!gardenRef.current) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playSound('tap');
      const uri = await captureRef(gardenRef, { format: 'png', quality: 0.9 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: t('garden.shareTitle') as string });
    } catch (err) {
      if (__DEV__) console.warn('[Share] Failed:', err);
    }
  };

  const handleAdReward = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    playSound('tap');
    const rewarded = await showRewardedAd();
    if (rewarded) {
      setAdRewardClaimed(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound('celebrate');
      Alert.alert(t('ad.rewardTitle') as string, t('ad.rewardMsg') as string);
    }
  };

  // Pre-compute plant display data so FlatList renderItem stays lean
  const plantData = useMemo(
    () =>
      plants.map((plant) => {
        const stage = getPlantStage(new Date(plant.planted_at));
        return {
          id: plant.id,
          plantId: plant.plant_type,
          stage,
        };
      }),
    [plants]
  );

  const renderPlant = useCallback(({ item, index }: { item: (typeof plantData)[number]; index: number }) => (
    <AnimatedPlant plantId={item.plantId} index={index} stage={item.stage} />
  ), []);

  const SKELETON_DATA = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  return (
    <SafeAreaView style={styles.container}>
      <View ref={gardenRef} collapsable={false} style={styles.gardenCapture}>
      {/* Dynamic sky gradient */}
      <SkyBackground visible={isFocused} />
      <RainEffect visible={refreshing} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{t('garden.title') as string}</Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            {plants.length === 0
              ? t('garden.empty') as string
              : (t('garden.plantCount') as (n: number) => string)(plants.length)}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {/* Share garden screenshot */}
          {plants.length > 0 && (
            <Pressable
              style={[styles.ambientBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={shareGarden}
              accessibilityLabel={t('garden.share') as string}
              accessibilityRole="button"
            >
              <ShareIcon size={16} color={colors.primary} />
            </Pressable>
          )}
          {/* Rewarded ad — rare plant (hide for premium users) */}
          {!isPremium && !adRewardClaimed && (
            <Pressable
              style={[styles.ambientBtn, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}
              onPress={handleAdReward}
              accessibilityLabel={t('ad.watchAd') as string}
              accessibilityRole="button"
            >
              <GiftIcon size={16} color={colors.accent} />
            </Pressable>
          )}
          <Pressable
            style={[styles.ambientBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={toggleAmbient}
            accessibilityLabel={ambientOn ? t('garden.soundOff') as string : t('garden.soundOn') as string}
            accessibilityRole="button"
          >
            {ambientOn ? <SoundOnIcon color={colors.primary} /> : <SoundOffIcon color={colors.textLight} />}
          </Pressable>
          {streak > 0 && (
            <View
              style={[styles.streakBadge, { backgroundColor: colors.card, borderColor: colors.border }]}
              accessibilityLabel={`${streak} ${t('garden.streakDays') as string}`}
              accessibilityRole="text"
            >
              <StreakIcon />
              <Text style={[styles.streakText, { color: colors.text }]}>{streak}d</Text>
            </View>
          )}
        </View>
      </View>

      {/* Garden area */}
      {loading ? (
        <FlatList
          data={SKELETON_DATA}
          numColumns={4}
          keyExtractor={(i) => String(i)}
          renderItem={() => <PlantCardSkeleton />}
          contentContainerStyle={styles.gardenContent}
          columnWrapperStyle={styles.gardenRow}
        />
      ) : plants.length === 0 ? (
        <EmptyGarden visible={isFocused} />
      ) : (
        <FlatList
          data={plantData}
          numColumns={4}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderPlant}
          contentContainerStyle={styles.gardenContent}
          columnWrapperStyle={styles.gardenRow}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          windowSize={5}
          maxToRenderPerBatch={8}
          initialNumToRender={12}
          getItemLayout={(_data, index) => ({
            length: 76, // 68 cell + 8 gap
            offset: 76 * Math.floor(index / 4),
            index,
          })}
        />
      )}

      </View>{/* end gardenCapture */}

      {/* CTA */}
      {!hasEntryToday && (
        <Animated.View entering={FadeInDown.springify().damping(12).stiffness(100)}>
          <PressableSpring
            style={[styles.plantButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              playSound('tap');
              router.push('/(app)/entry');
            }}
          >
            <Text style={styles.plantButtonText}>{t('garden.plantToday') as string}</Text>
          </PressableSpring>
        </Animated.View>
      )}

      {/* Idle floating particles — on top of everything, no touch blocking */}
      <GardenParticles visible={isFocused} />

      {/* Streak Milestone Celebration */}
      {milestoneInfo && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.milestoneOverlay}
          pointerEvents="none"
        >
          <ConfettiCannon
            ref={confettiRef}
            count={80}
            origin={{ x: -10, y: 0 }}
            fadeOut
            autoStart
          />
          <Animated.View
            entering={ZoomIn.springify().damping(10).stiffness(120)}
            style={[styles.milestoneCard, { backgroundColor: colors.card, borderColor: colors.primary }]}
          >
            <Text style={styles.milestoneEmoji}>{milestoneInfo.emoji}</Text>
            <Text style={[styles.milestoneMessage, { color: colors.text }]}>
              {t(milestoneInfo.messageKey as any) as string}
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background handled by SkyBackground gradient
  },
  gardenCapture: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ambientBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  gardenContent: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 8,
  },
  gardenRow: {
    gap: 8,
    marginBottom: 8,
  },
  emptyGarden: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  plantButton: {
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  plantButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  milestoneOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  milestoneEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  milestoneMessage: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
});
