import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  Alert,
  InteractionManager,
  Keyboard,
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
import { getAllPlants, getCurrentStreak, getEntryByDate, PlantRow, kvGetBool, kvSetBool, kvGet, kvSet, createUnlock } from '../../lib/database';
import { getPlantStage, STREAK_REWARDS } from '../../constants/Plants';
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

const PERIOD_EMOJI: Record<string, string> = {
  dawn: '\u{1F305}',
  morning: '\u{2600}\u{FE0F}',
  afternoon: '\u{1F324}\u{FE0F}',
  sunset: '\u{1F307}',
  night: '\u{1F319}',
};

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
  const [gardenName, setGardenName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const nameInputRef = useRef<TextInput>(null);
  const confettiRef = useRef<ConfettiCannon | null>(null);
  const milestoneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gardenRef = useRef<View>(null);
  const router = useRouter();
  const isFocused = useIsFocused();

  const loadData = useCallback(async () => {
    try {
      const [allPlants, currentStreak, todayEntry, adClaimed, savedName] = await Promise.all([
        getAllPlants(),
        getCurrentStreak(),
        getEntryByDate(getTodayStr()),
        hasClaimedAdRewardToday(),
        kvGet('garden_name'),
      ]);
      setPlants(allPlants);
      setStreak(currentStreak);
      setHasEntryToday(!!todayEntry);
      setAdRewardClaimed(adClaimed);
      setGardenName(savedName || '');

      // Check streak milestones & unlock reward plants
      const milestone = MILESTONES[currentStreak];
      if (milestone) {
        const alreadyCelebrated = await kvGetBool(`milestone_${currentStreak}`);
        if (!alreadyCelebrated) {
          await kvSetBool(`milestone_${currentStreak}`, true);
          const rewardPlantId = STREAK_REWARDS[currentStreak];
          if (rewardPlantId) {
            await createUnlock('plant', rewardPlantId, `streak:${currentStreak}`);
          }
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
      // Defer DB queries until animations/transitions settle
      const task = InteractionManager.runAfterInteractions(() => {
        loadData();
        if (!isAmbientPlaying()) {
          playAmbientForPeriod(timePeriod)
            .then(() => setAmbientOn(true))
            .catch(() => {});
        }
      });
      return () => {
        task.cancel();
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

  const startEditingName = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNameInput(gardenName || (t('garden.title') as string));
    setEditingName(true);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const saveGardenName = async () => {
    const trimmed = nameInput.trim();
    const defaultTitle = t('garden.title') as string;
    const finalName = trimmed === defaultTitle ? '' : trimmed;
    setGardenName(finalName);
    setEditingName(false);
    Keyboard.dismiss();
    await kvSet('garden_name', finalName);
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
        <View style={styles.headerLeft}>
          {editingName ? (
            <TextInput
              ref={nameInputRef}
              style={[styles.title, styles.titleInput, { color: colors.text, borderColor: colors.primary }]}
              value={nameInput}
              onChangeText={setNameInput}
              onBlur={saveGardenName}
              onSubmitEditing={saveGardenName}
              maxLength={24}
              returnKeyType="done"
              selectTextOnFocus
            />
          ) : (
            <Pressable onLongPress={startEditingName}>
              <Text style={[styles.title, { color: colors.text }]}>
                {gardenName || (t('garden.title') as string)}
              </Text>
            </Pressable>
          )}
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            {plants.length === 0
              ? t('garden.empty') as string
              : `${(t('garden.plantCount') as (n: number) => string)(plants.length)}  ${PERIOD_EMOJI[timePeriod] || ''}`}
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
            length: 88, // 76 cell + 12 gap
            offset: 88 * Math.floor(index / 4),
            index,
          })}
        />
      )}

      {/* CTA — inside gardenCapture so it sits on the sky background */}
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

      </View>{/* end gardenCapture */}

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
            count={40}
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
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.text,
  },
  titleInput: {
    borderBottomWidth: 2,
    paddingVertical: 2,
    paddingHorizontal: 0,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textLight,
    marginTop: 6,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    padding: 20,
    paddingTop: 56,
    paddingBottom: 90,
  },
  gardenRow: {
    gap: 12,
    marginBottom: 12,
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
    marginBottom: 90,
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
