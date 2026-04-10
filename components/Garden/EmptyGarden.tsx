import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  cancelAnimation,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../lib/i18n';

const BREATHING = Easing.bezier(0.45, 0.0, 0.55, 1.0);

// Sparkle positions around the seedling (angle in degrees, distance from center)
const SPARKLES = [
  { angle: 30, dist: 55 },
  { angle: 140, dist: 50 },
  { angle: 250, dist: 60 },
  { angle: 330, dist: 45 },
];

export function EmptyGarden({ visible = true }: { visible?: boolean }) {
  const { colors } = useTheme();

  // 1. Seedling bob (translateY)
  const seedlingY = useSharedValue(0);
  // 2. Glow pulse (scale)
  const glowScale = useSharedValue(1);
  // 3. Text fade (opacity)
  const textOpacity = useSharedValue(0);
  // 4. Sparkle shared opacity (staggered per sparkle via withDelay)
  const sparkle0 = useSharedValue(0);
  const sparkle1 = useSharedValue(0);
  const sparkle2 = useSharedValue(0);
  const sparkle3 = useSharedValue(0);

  const sparkleValues = [sparkle0, sparkle1, sparkle2, sparkle3];

  useEffect(() => {
    if (!visible) {
      cancelAnimation(seedlingY);
      cancelAnimation(glowScale);
      cancelAnimation(textOpacity);
      sparkleValues.forEach((sv) => cancelAnimation(sv));
      return;
    }

    // Seedling breathing bob
    seedlingY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1800, easing: BREATHING }),
        withTiming(0, { duration: 1800, easing: BREATHING }),
      ),
      -1,
      false,
    );

    // Glow pulsing
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 2200, easing: BREATHING }),
        withTiming(1, { duration: 2200, easing: BREATHING }),
      ),
      -1,
      false,
    );

    // Text fade in after a short delay
    textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));

    // Sparkles: staggered blinking
    sparkleValues.forEach((sv, i) => {
      sv.value = withDelay(
        i * 350,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 1200, easing: BREATHING }),
            withTiming(0.15, { duration: 1200, easing: BREATHING }),
          ),
          -1,
          false,
        ),
      );
    });

    return () => {
      cancelAnimation(seedlingY);
      cancelAnimation(glowScale);
      cancelAnimation(textOpacity);
      sparkleValues.forEach((sv) => cancelAnimation(sv));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const seedlingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: seedlingY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  // Pre-compute static positions (no hooks needed — positions never change)
  const sparkle0Rad = (SPARKLES[0].angle * Math.PI) / 180;
  const sparkle1Rad = (SPARKLES[1].angle * Math.PI) / 180;
  const sparkle2Rad = (SPARKLES[2].angle * Math.PI) / 180;
  const sparkle3Rad = (SPARKLES[3].angle * Math.PI) / 180;

  const sparkleStyle0 = useAnimatedStyle(() => ({
    opacity: sparkle0.value,
    transform: [{ translateX: Math.cos(sparkle0Rad) * SPARKLES[0].dist }, { translateY: Math.sin(sparkle0Rad) * SPARKLES[0].dist }],
  }));
  const sparkleStyle1 = useAnimatedStyle(() => ({
    opacity: sparkle1.value,
    transform: [{ translateX: Math.cos(sparkle1Rad) * SPARKLES[1].dist }, { translateY: Math.sin(sparkle1Rad) * SPARKLES[1].dist }],
  }));
  const sparkleStyle2 = useAnimatedStyle(() => ({
    opacity: sparkle2.value,
    transform: [{ translateX: Math.cos(sparkle2Rad) * SPARKLES[2].dist }, { translateY: Math.sin(sparkle2Rad) * SPARKLES[2].dist }],
  }));
  const sparkleStyle3 = useAnimatedStyle(() => ({
    opacity: sparkle3.value,
    transform: [{ translateX: Math.cos(sparkle3Rad) * SPARKLES[3].dist }, { translateY: Math.sin(sparkle3Rad) * SPARKLES[3].dist }],
  }));

  const sparkleStyles = [sparkleStyle0, sparkleStyle1, sparkleStyle2, sparkleStyle3];

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      {/* Pulsing glow behind seedling */}
      <Animated.View
        style={[
          styles.glow,
          { backgroundColor: colors.primary },
          glowStyle,
        ]}
      />

      {/* Sparkle dots */}
      {sparkleStyles.map((style, i) => (
        <Animated.View
          key={i}
          style={[
            styles.sparkle,
            { backgroundColor: colors.primary },
            style,
          ]}
        />
      ))}

      {/* Seedling emoji */}
      <Animated.View style={seedlingStyle}>
        <Text style={styles.seedling}>🌱</Text>
      </Animated.View>

      {/* Label */}
      <Animated.View style={textStyle}>
        <Text style={[styles.label, { color: colors.textLight }]}>
          {t('garden.empty') as string}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.12,
  },
  sparkle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0,
  },
  seedling: {
    fontSize: 64,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 16,
  },
});
