import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import type { TimePeriod } from '../../constants/Colors';

// ─── Constants ────────────────────────────────────────────

const SUN_SIZE = 50;
const MOON_SIZE = 40;
const FIREFLY_COUNT = 5;

// Sun config per time period
const SUN_CONFIG: Record<
  'dawn' | 'morning' | 'afternoon' | 'sunset',
  { topPercent: number; color: string; glowColor: string; glowSize: number }
> = {
  dawn:      { topPercent: 60, color: '#FFA54F', glowColor: '#FFA54F', glowSize: 30 },
  morning:   { topPercent: 25, color: '#FFD700', glowColor: '#FFD700', glowSize: 25 },
  afternoon: { topPercent: 15, color: '#FFFACD', glowColor: '#FFE87C', glowSize: 25 },
  sunset:    { topPercent: 65, color: '#FF6347', glowColor: '#FF4500', glowSize: 40 },
};

// Pre-generate star positions (static)
const STARS: StarData[] = Array.from({ length: 6 }, () => ({
  x: `${5 + Math.random() * 90}%`,
  y: `${5 + Math.random() * 45}%`,
  size: 1.5 + Math.random() * 2,
  delay: Math.random() * 3000,
}));

// Pre-generate firefly positions (static)
interface FireflyData {
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  size: number;
  durationX: number;
  durationY: number;
  opacityDuration: number;
  delay: number;
}

const FIREFLIES: FireflyData[] = Array.from({ length: FIREFLY_COUNT }, () => ({
  startX: 10 + Math.random() * 80,
  startY: 15 + Math.random() * 60,
  driftX: (Math.random() - 0.5) * 40,
  driftY: (Math.random() - 0.5) * 30,
  size: 3 + Math.random() * 1.5,
  durationX: 3000 + Math.random() * 2000,
  durationY: 3500 + Math.random() * 1500,
  opacityDuration: 2000 + Math.random() * 2000,
  delay: Math.random() * 2000,
}));

// ─── Main Component ───────────────────────────────────────

export function SkyBackground({ visible = true }: { visible?: boolean }) {
  const { skyGradient, timePeriod, isDark, darkModePreference } = useTheme();

  // When user forces light mode at night, show sun instead of moon
  const forcedLight = darkModePreference === 'light' && timePeriod === 'night';
  const forcedDark = darkModePreference === 'dark' && timePeriod !== 'night';

  const showSun = forcedLight || (!forcedDark && (timePeriod === 'dawn' || timePeriod === 'morning' || timePeriod === 'afternoon' || timePeriod === 'sunset'));
  const showMoon = forcedDark || (!forcedLight && timePeriod === 'night');
  const showFireflies = isDark;
  const showStars = isDark;

  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={skyGradient as unknown as [string, string, ...string[]]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {showSun && (
        <Sun
          timePeriod={
            timePeriod === 'night'
              ? 'afternoon' // forced light mode at night → show afternoon sun
              : (timePeriod as 'dawn' | 'morning' | 'afternoon' | 'sunset')
          }
          visible={visible}
        />
      )}
      {showMoon && <Moon skyColor={skyGradient[0] as string} visible={visible} />}
      {showStars && <StarsOverlay visible={visible} />}
      {showFireflies && <FirefliesOverlay visible={visible} />}
    </View>
  );
}

// ─── Sun ──────────────────────────────────────────────────

const Sun = React.memo(function Sun({
  timePeriod,
  visible,
}: {
  timePeriod: 'dawn' | 'morning' | 'afternoon' | 'sunset';
  visible: boolean;
}) {
  const config = SUN_CONFIG[timePeriod];
  const glowScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      glowScale.value = withRepeat(
        withTiming(1.18, {
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
        }),
        -1, // infinite
        true // reverse
      );
    } else {
      cancelAnimation(glowScale);
    }

    return () => {
      cancelAnimation(glowScale);
    };
  }, [timePeriod, visible]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <View
      style={[
        styles.sunAnchor,
        { top: `${config.topPercent}%` as any },
      ]}
      pointerEvents="none"
    >
      {/* Glow layer */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: SUN_SIZE + config.glowSize * 2,
            height: SUN_SIZE + config.glowSize * 2,
            borderRadius: (SUN_SIZE + config.glowSize * 2) / 2,
            backgroundColor: config.glowColor,
            opacity: 0.25,
            left: -(config.glowSize),
            top: -(config.glowSize),
          },
          glowStyle,
        ]}
      />
      {/* Sun disc */}
      <View
        style={{
          width: SUN_SIZE,
          height: SUN_SIZE,
          borderRadius: SUN_SIZE / 2,
          backgroundColor: config.color,
          shadowColor: config.glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 15,
          elevation: 0,
        }}
      />
    </View>
  );
});

// ─── Moon ─────────────────────────────────────────────────

const Moon = React.memo(function Moon({ skyColor, visible }: { skyColor: string; visible: boolean }) {
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    if (visible) {
      glowOpacity.value = withRepeat(
        withTiming(0.55, {
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    } else {
      cancelAnimation(glowOpacity);
    }

    return () => {
      cancelAnimation(glowOpacity);
    };
  }, [visible]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.moonAnchor} pointerEvents="none">
      {/* Glow */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: MOON_SIZE + 30,
            height: MOON_SIZE + 30,
            borderRadius: (MOON_SIZE + 30) / 2,
            backgroundColor: '#C8D8FF',
            left: -15,
            top: -15,
          },
          glowStyle,
        ]}
      />
      {/* Moon disc (full circle) */}
      <View
        style={{
          width: MOON_SIZE,
          height: MOON_SIZE,
          borderRadius: MOON_SIZE / 2,
          backgroundColor: '#E8EEFF',
          shadowColor: '#C8D8FF',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 0,
        }}
      />
      {/* Crescent mask — overlapping circle to carve out crescent shape */}
      <View
        style={{
          position: 'absolute',
          width: MOON_SIZE * 0.8,
          height: MOON_SIZE * 0.8,
          borderRadius: (MOON_SIZE * 0.8) / 2,
          backgroundColor: skyColor, // match sky background color
          left: MOON_SIZE * 0.3,
          top: -MOON_SIZE * 0.05,
        }}
      />
    </View>
  );
});

// ─── Fireflies ────────────────────────────────────────────

const FirefliesOverlay = React.memo(function FirefliesOverlay({ visible }: { visible: boolean }) {
  return (
    <View style={styles.starsContainer} pointerEvents="none">
      {FIREFLIES.map((ff, i) => (
        <Firefly key={i} data={ff} visible={visible} />
      ))}
    </View>
  );
});

const Firefly = React.memo(function Firefly({ data, visible }: { data: FireflyData; visible: boolean }) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      cancelAnimation(translateX);
      cancelAnimation(opacity);
      return;
    }

    // Pure reanimated delay — no JS setTimeout
    translateX.value = withDelay(
      data.delay,
      withRepeat(
        withTiming(data.driftX, {
          duration: data.durationX,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      data.delay,
      withRepeat(
        withTiming(0.9, {
          duration: data.opacityDuration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    return () => {
      cancelAnimation(translateX);
      cancelAnimation(opacity);
    };
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: `${data.startX}%` as any,
          top: `${data.startY}%` as any,
          width: data.size,
          height: data.size,
          borderRadius: data.size / 2,
          backgroundColor: '#FFE88C',
          shadowColor: '#FFE88C',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 6,
          elevation: 0,
        },
        animStyle,
      ]}
    />
  );
});

// ─── Stars (existing, kept intact) ───────────────────────

interface StarData {
  x: string;
  y: string;
  size: number;
  delay: number;
}

const StarsOverlay = React.memo(function StarsOverlay({ visible }: { visible: boolean }) {
  return (
    <View style={styles.starsContainer} pointerEvents="none">
      {STARS.map((star, i) => (
        <TwinkleStar key={i} star={star} visible={visible} />
      ))}
    </View>
  );
});

const TwinkleStar = React.memo(function TwinkleStar({ star, visible }: { star: StarData; visible: boolean }) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    if (!visible) {
      cancelAnimation(opacity);
      return;
    }

    // Pure reanimated loop — no JS setInterval, no Math.random on UI thread
    const cycleDuration = 2000 + star.delay;
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: cycleDuration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration: cycleDuration, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    return () => {
      cancelAnimation(opacity);
    };
  }, [visible]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: star.x as any,
          top: star.y as any,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: '#FFFFFF',
        },
        animStyle,
      ]}
    />
  );
});

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  sunAnchor: {
    position: 'absolute',
    alignSelf: 'center',
    // horizontally centered via alignSelf, top set dynamically
    width: SUN_SIZE,
    height: SUN_SIZE,
  },
  moonAnchor: {
    position: 'absolute',
    top: '8%' as any,
    left: '10%' as any,
    width: MOON_SIZE,
    height: MOON_SIZE,
  },
});
