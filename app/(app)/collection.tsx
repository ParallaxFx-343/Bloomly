import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const snapEase = Easing.bezier(0.34, 1.56, 0.64, 1);
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { Colors } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { PLANTS, PlantType } from '../../constants/Plants';
import { PlantSVG } from '../../components/Plants/PlantSVG';
import { AnimatedPressable } from '../../components/Common/PressableSpring';
import { playSound } from '../../lib/sounds';
import { t } from '../../lib/i18n';
import { usePremium } from '../../contexts/PremiumContext';

const PlantCard = React.memo(function PlantCard({ plant, isPremium, index }: { plant: PlantType; isPremium?: boolean; index: number }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playSound('tap');
    scale.value = withSequence(
      withTiming(1.12, { duration: 100, easing: snapEase }),
      withTiming(1, { duration: 180, easing: snapEase })
    );
  };

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index * 40, 300)).duration(300)} style={styles.plantCardWrap}>
      <AnimatedPressable
        style={[
          styles.plantCard,
          { backgroundColor: colors.card, borderColor: colors.border },
          isPremium && [styles.premiumCard, { borderColor: colors.secondary }],
          animStyle,
        ]}
        onPress={handlePress}
      >
        <PlantSVG plantId={plant.id} stage="flower" size={40} />
        <Text style={[styles.plantName, { color: colors.text }]}>{plant.name}</Text>
        {isPremium && (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Rect x={5} y={11} width={14} height={11} rx={2} fill={colors.textLight} fillOpacity={0.3} stroke={colors.textLight} strokeWidth={1.5} />
            <Path d="M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11" stroke={colors.textLight} strokeWidth={1.5} strokeLinecap="round" />
          </Svg>
        )}
      </AnimatedPressable>
    </Animated.View>
  );
});

export default function CollectionScreen() {
  const { colors } = useTheme();
  const { isPremium } = usePremium();
  const freePlants = useMemo(() => PLANTS.filter((p) => !p.premium), []);
  const premiumPlants = useMemo(() => PLANTS.filter((p) => p.premium), []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.Text entering={FadeInDown.delay(50).duration(400)} style={[styles.title, { color: colors.text }]}>
          {t('collection.title') as string}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(100).duration(400)} style={[styles.subtitle, { color: colors.textLight }]}>
          {t('collection.subtitle') as string}
        </Animated.Text>

        {/* Free plants */}
        <Animated.Text entering={FadeIn.delay(150).duration(300)} style={[styles.sectionTitle, { color: colors.text }]}>
          {t('collection.basic') as string}
        </Animated.Text>
        <View style={styles.grid}>
          {freePlants.map((plant, i) => (
            <PlantCard key={plant.id} plant={plant} index={i} />
          ))}
        </View>

        {/* Premium plants */}
        <Animated.Text entering={FadeIn.delay(200).duration(300)} style={[styles.sectionTitle, { color: colors.text }]}>
          {t('collection.premium') as string}
        </Animated.Text>
        <View style={styles.grid}>
          {premiumPlants.map((plant, i) => (
            <PlantCard key={plant.id} plant={plant} isPremium={!isPremium} index={freePlants.length + i} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  plantCardWrap: {
    width: '29%',
  },
  plantCard: {
    aspectRatio: 0.85,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  premiumCard: {
    opacity: 0.6,
    borderStyle: 'dashed',
  },
  plantSvg: {
    marginBottom: 2,
  },
  plantName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  lockEmoji: {
    fontSize: 14,
  },
});
