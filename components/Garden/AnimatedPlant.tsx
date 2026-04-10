import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/Colors';
import { playSound } from '../../lib/sounds';
import { t } from '../../lib/i18n';
import { PlantSVG } from '../Plants/PlantSVG';
import type { PlantStage } from '../../constants/Plants';

interface AnimatedPlantProps {
  plantId: string;
  index: number;
  stage: PlantStage;
}

// Shared easings — defined once, reused by all instances
const breatheEase = Easing.bezier(0.45, 0.0, 0.55, 1.0);
const snapEase = Easing.bezier(0.34, 1.56, 0.64, 1); // overshoot ease — mimics spring, much cheaper

export const AnimatedPlant = React.memo(function AnimatedPlant({ plantId, index, stage }: AnimatedPlantProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const idleY = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Cap stagger delay so large gardens don't feel sluggish
    const delay = Math.min(index * 50, 400);

    // Pop-in: single spring for scale, fast timing for opacity
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 14, stiffness: 120, mass: 0.6 })
    );
    opacity.value = withDelay(delay, withTiming(1, { duration: 250 }));

    // Idle breathing — longer duration = fewer frames computed per second
    // Reduced amplitude from ±2.5 to ±1.5 (less GPU repainting)
    const breatheDuration = 2500 + (index % 5) * 200; // mod 5 instead of linear — only 5 unique durations
    idleY.value = withDelay(
      delay + 300,
      withRepeat(
        withSequence(
          withTiming(-1.5, { duration: breatheDuration, easing: breatheEase }),
          withTiming(1.5, { duration: breatheDuration, easing: breatheEase })
        ),
        -1,
        true
      )
    );

    // Flowers get gentle sway — same driver count, just adds rotation
    if (stage === 'flower') {
      rotation.value = withDelay(
        delay + 400,
        withRepeat(
          withSequence(
            withTiming(3, { duration: 3000, easing: breatheEase }),
            withTiming(-3, { duration: 3000, easing: breatheEase })
          ),
          -1,
          true
        )
      );
    }

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      cancelAnimation(idleY);
      cancelAnimation(rotation);
    };
  }, [stage]);

  const handleTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playSound('tap');

    // Cancel any running idle before tap animation
    cancelAnimation(scale);
    cancelAnimation(rotation);

    // withTiming + overshoot easing instead of withSpring chain — much cheaper
    scale.value = withSequence(
      withTiming(1.15, { duration: 100, easing: snapEase }),
      withTiming(1, { duration: 200, easing: snapEase })
    );
    rotation.value = withSequence(
      withTiming(8, { duration: 80, easing: snapEase }),
      withTiming(-4, { duration: 120, easing: snapEase }),
      withTiming(0, { duration: 150, easing: breatheEase })
    );
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: idleY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Pressable onPress={handleTap}>
      <Animated.View style={[styles.cell, { backgroundColor: colors.card, borderColor: colors.border }, animStyle]}>
        <PlantSVG plantId={plantId} stage={stage} size={40} />
        {stage === 'seed' && <Text style={[styles.stageLabel, { color: colors.textLight }]}>{t('plant.stageSeed') as string}</Text>}
        {stage === 'sprout' && <Text style={[styles.stageLabel, { color: colors.textLight }]}>{t('plant.stageSprout') as string}</Text>}
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cell: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
  },
  svgWrap: {
    width: 40,
    height: 40,
  },
  stageLabel: {
    fontSize: 9,
    color: Colors.textLight,
    marginTop: 1,
  },
});
