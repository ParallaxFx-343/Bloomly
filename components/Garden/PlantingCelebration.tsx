import { useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/Colors';
import { t } from '../../lib/i18n';

const { width, height } = Dimensions.get('window');

interface PlantingCelebrationProps {
  visible: boolean;
  onComplete?: () => void;
}

export function PlantingCelebration({ visible, onComplete }: PlantingCelebrationProps) {
  const { colors, isDark } = useTheme();
  const confettiRef = useRef<any>(null);
  const messageScale = useSharedValue(0);
  const messageOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Animate the success message
      messageOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(1200, withTiming(0, { duration: 300 }))
      );
      messageScale.value = withSequence(
        withSpring(1.1, { damping: 6, stiffness: 150 }),
        withSpring(1, { damping: 10, stiffness: 200 })
      );

      // Fire confetti
      const confettiTimer = setTimeout(() => confettiRef.current?.start(), 50);
      const completeTimer = onComplete ? setTimeout(onComplete, 2000) : undefined;

      return () => {
        clearTimeout(confettiTimer);
        if (completeTimer !== undefined) clearTimeout(completeTimer);
        messageOpacity.value = 0;
        messageScale.value = 0;
      };
    } else {
      messageOpacity.value = 0;
      messageScale.value = 0;
    }
  }, [visible, onComplete]);

  const messageStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
    transform: [{ scale: messageScale.value }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <BlurView intensity={40} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFillObject} />
      <ConfettiCannon
        ref={confettiRef}
        count={80}
        origin={{ x: width / 2, y: -20 }}
        explosionSpeed={350}
        fallSpeed={2500}
        fadeOut
        autoStart={false}
        colors={[
          Colors.primary,
          Colors.accent,
          Colors.secondary,
          Colors.earth,
          '#F59E0B',
          Colors.primaryLight,
        ]}
      />
      <Animated.View style={[styles.messageWrap, { backgroundColor: colors.card + 'F0' }, messageStyle]}>
        <Text style={styles.messageEmoji}>🌱</Text>
        <Text style={[styles.messageText, { color: colors.primary }]}>{t('entry.planted') as string}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageWrap: {
    backgroundColor: Colors.card + 'F0',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  messageEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
});
