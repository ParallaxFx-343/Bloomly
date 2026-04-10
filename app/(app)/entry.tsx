import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const snapEase = Easing.bezier(0.34, 1.56, 0.64, 1);
import { PressableSpring } from '../../components/Common/PressableSpring';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/Colors';
import { CATEGORIES, CategoryId } from '../../constants/Categories';
import { PLANTS, PlantType } from '../../constants/Plants';
import { createEntry, createPlant, getEntryByDate } from '../../lib/database';
import { AnimatedCategoryCard } from '../../components/Entry/AnimatedCategoryCard';
import { PlantingCelebration } from '../../components/Garden/PlantingCelebration';
import { PlantSVG } from '../../components/Plants/PlantSVG';
import { playSound } from '../../lib/sounds';
import { getTodayStr } from '../../lib/utils';
import { t } from '../../lib/i18n';
import { usePremium } from '../../contexts/PremiumContext';
import { hasClaimedAdRewardToday } from '../../lib/ads';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function randomPosition(): { x: number; y: number } {
  return {
    x: Math.random() * 0.8 + 0.1,
    y: Math.random() * 0.8 + 0.1,
  };
}

/** Get available plants for selected categories (premium unlocked if user has premium) */
function getAvailablePlants(categories: CategoryId[], hasPremium: boolean): PlantType[] {
  const catSet = new Set(categories);
  return PLANTS.filter((p) => catSet.has(p.category) && (hasPremium || !p.premium));
}

export default function EntryScreen() {
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const [selected, setSelected] = useState<Set<CategoryId>>(new Set());
  const [chosenPlant, setChosenPlant] = useState<PlantType | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [adRewardActive, setAdRewardActive] = useState(false);
  const router = useRouter();

  // Check ad reward on mount
  React.useEffect(() => {
    hasClaimedAdRewardToday().then(setAdRewardActive);
  }, []);

  const placeholder = useMemo(() => {
    const prompts = Array.from({ length: 8 }, (_, i) => t(`prompt.${i}` as any) as string);
    return prompts[Math.floor(Math.random() * prompts.length)];
  }, []);

  const toggleCategory = useCallback((id: CategoryId) => {
    playSound('tap');
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
    // Reset plant choice when categories change
    setChosenPlant(null);
  }, []);

  const canUsePremiumPlants = isPremium || adRewardActive;
  const availablePlants = useMemo(() => getAvailablePlants(Array.from(selected), canUsePremiumPlants), [selected, canUsePremiumPlants]);

  const handlePlant = async () => {
    if (selected.size === 0) {
      Alert.alert(t('entry.alertNoCat') as string, t('entry.alertNoCatMsg') as string);
      return;
    }
    if (!chosenPlant) {
      Alert.alert(t('entry.alertNoPlant') as string, t('entry.alertNoPlantMsg') as string);
      return;
    }

    setSaving(true);
    try {
      const today = getTodayStr();
      const existing = await getEntryByDate(today);
      if (existing) {
        setSaving(false);
        Alert.alert(t('entry.alertAlready') as string, t('entry.alertAlreadyMsg') as string, [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }

      const categories = Array.from(selected);
      const entryId = await createEntry(today, categories, chosenPlant.id, note || undefined);
      const pos = randomPosition();
      await createPlant(entryId, chosenPlant.id, pos.x, pos.y);

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        playSound('celebrate');
      } catch {}
      setCelebrating(true);
      setSaving(false);
    } catch (err) {
      console.error('Error saving entry:', err);
      Alert.alert(t('entry.alertError') as string, t('entry.alertErrorMsg') as string);
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <PlantingCelebration
        visible={celebrating}
        onComplete={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.Text entering={FadeInDown.delay(100).duration(400)} style={[styles.title, { color: colors.text }]}>
          {t('entry.title') as string}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(200).duration(400)} style={[styles.subtitle, { color: colors.textLight }]}>
          {t('entry.subtitle') as string}
        </Animated.Text>

        {/* Category Grid */}
        <Animated.View
          entering={FadeInDown.delay(300).springify().damping(14)}
          style={styles.grid}
        >
          {CATEGORIES.map((cat) => (
            <AnimatedCategoryCard
              key={cat.id}
              category={cat}
              isSelected={selected.has(cat.id)}
              onPress={toggleCategory}
            />
          ))}
        </Animated.View>

        {/* Plant Picker - appears after selecting categories */}
        {selected.size > 0 && (
          <Animated.View entering={FadeInUp.delay(100).duration(400)}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('entry.pickPlant') as string}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.plantPicker}
            >
              {availablePlants.map((plant) => (
                <PlantOption
                  key={plant.id}
                  plant={plant}
                  isSelected={chosenPlant?.id === plant.id}
                  onPress={() => {
                    playSound('tap');
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setChosenPlant(plant);
                  }}
                />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Note */}
        <Animated.View entering={FadeIn.delay(500).duration(400)}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>{t('entry.noteLabel') as string}</Text>
          <TextInput
            style={[styles.noteInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder={placeholder}
            placeholderTextColor={colors.textLight}
            value={note}
            onChangeText={setNote}
            maxLength={200}
            multiline
          />
        </Animated.View>

        {/* Plant button — spring press */}
        <Animated.View entering={FadeInDown.delay(600).springify().damping(12)}>
          <PressableSpring
            style={[
              styles.plantButton,
              { backgroundColor: colors.primary },
              (saving || !chosenPlant || selected.size === 0) && styles.plantButtonDisabled,
            ]}
            disabled={saving || !chosenPlant || selected.size === 0}
            onPress={handlePlant}
          >
            <Text style={styles.plantButtonText}>
              {saving
                ? t('entry.planting') as string
                : chosenPlant
                  ? (t('entry.plantName') as (name: string) => string)(chosenPlant.name)
                  : t('entry.plantSeed') as string}
            </Text>
          </PressableSpring>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** Individual plant option in the horizontal picker */
const PlantOption = React.memo(function PlantOption({
  plant,
  isSelected,
  onPress,
}: {
  plant: PlantType;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 80, easing: snapEase }),
      withTiming(1, { duration: 160, easing: snapEase })
    );
    onPress();
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[
        styles.plantOption,
        { backgroundColor: colors.card, borderColor: colors.border },
        isSelected && [styles.plantOptionSelected, { borderColor: colors.primary, backgroundColor: colors.primary + '15' }],
        animStyle,
      ]}
      onPress={handlePress}
    >
      <PlantSVG plantId={plant.id} stage="flower" size={36} />
      <Text style={[
        styles.plantOptionName,
        { color: colors.textLight },
        isSelected && { color: colors.primary, fontWeight: '700' },
      ]}>
        {plant.name}
      </Text>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  plantPicker: {
    gap: 12,
    paddingBottom: 4,
    marginBottom: 24,
  },
  plantOption: {
    width: 80,
    height: 90,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  plantOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
    borderWidth: 2.5,
  },
  plantOptionSvg: {
    marginBottom: 2,
  },
  plantOptionName: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '500',
  },
  noteInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  plantButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  plantButtonDisabled: {
    opacity: 0.5,
  },
  plantButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
