import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const DROP_COUNT = 14;

interface RainDrop {
  x: number;
  w: number;
  h: number;
  delay: number;
  duration: number;
}

function generateDrops(): RainDrop[] {
  return Array.from({ length: DROP_COUNT }, () => ({
    x: Math.random() * width,
    w: 1.5 + Math.random() * 0.5,
    h: 15 + Math.random() * 10,
    delay: Math.random() * 1200,
    duration: 800 + Math.random() * 600,
  }));
}

const DROPS = generateDrops();

const Drop = React.memo(function Drop({
  drop,
  color,
}: {
  drop: RainDrop;
  color: string;
}) {
  const translateY = useSharedValue(-30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const target = height + 40;

    translateY.value = withDelay(
      drop.delay,
      withRepeat(
        withTiming(target, {
          duration: drop.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      drop.delay,
      withRepeat(
        withTiming(1, { duration: drop.duration * 0.15 }),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: drop.x,
          top: -30,
          width: drop.w,
          height: drop.h,
          borderRadius: drop.w,
          backgroundColor: color,
        },
        animStyle,
      ]}
    />
  );
});

export function RainEffect({ visible }: { visible: boolean }) {
  const { colors } = useTheme();

  if (!visible) return null;

  const dropColor = colors.primary + '40';

  return (
    <Animated.View style={styles.container} pointerEvents="none">
      {DROPS.map((drop, i) => (
        <Drop key={i} drop={drop} color={dropColor} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
