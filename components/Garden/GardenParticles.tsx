import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

interface FloatingParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
}

const PARTICLE_COLORS = [
  Colors.primary + '25',
  Colors.accent + '20',
  Colors.secondary + '20',
  Colors.earth + '15',
];

function generateParticles(count: number): FloatingParticle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.7 + 50,
    size: 5 + Math.random() * 6,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    delay: Math.random() * 4000,
    duration: 5000 + Math.random() * 3000,
    driftX: (Math.random() - 0.5) * 25,
    driftY: -15 - Math.random() * 20,
  }));
}

// Merged: 2 drivers per particle instead of 3 (opacity embedded in color via static alpha)
const Particle = React.memo(function Particle({ particle, visible }: { particle: FloatingParticle; visible: boolean }) {
  // Single progress value drives both X and Y movement
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      cancelAnimation(progress);
      cancelAnimation(opacity);
      return;
    }

    // Longer durations = fewer frame calculations
    progress.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(1, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: particle.duration * 0.3 }),
          withTiming(0.7, { duration: particle.duration * 0.4 }),
          withTiming(0, { duration: particle.duration * 0.3 })
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(progress);
      cancelAnimation(opacity);
    };
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * particle.driftX },
      { translateY: progress.value * particle.driftY },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
        },
        animStyle,
      ]}
    />
  );
});

// 5 particles — enough for ambiance, saves 6 animation drivers vs 8
const PARTICLES = generateParticles(5);

export function GardenParticles({ visible = true }: { visible?: boolean }) {
  return (
    <View style={styles.container} pointerEvents="none">
      {PARTICLES.map((p, i) => (
        <Particle key={i} particle={p} visible={visible} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});
