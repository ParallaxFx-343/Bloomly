import { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';

interface ShimmerProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Shimmer({ width, height, borderRadius = 12, style }: ShimmerProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    return () => cancelAnimation(progress);
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0.3, 0.7, 0.3]);
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: Colors.earth + '30',
        },
        animStyle,
        style,
      ]}
    />
  );
}

/** Skeleton placeholder for a plant card */
export function PlantCardSkeleton() {
  return <Shimmer width={76} height={76} borderRadius={18} />;
}

/** Skeleton placeholder for a full-width row */
export function RowSkeleton({ style }: { style?: ViewStyle }) {
  return (
    <Animated.View style={[skeletonStyles.row, style]}>
      <Shimmer width={40} height={40} borderRadius={20} />
      <Animated.View style={skeletonStyles.lines}>
        <Shimmer width="70%" height={12} borderRadius={6} />
        <Shimmer width="45%" height={10} borderRadius={5} style={{ marginTop: 6 }} />
      </Animated.View>
    </Animated.View>
  );
}

const skeletonStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  lines: {
    flex: 1,
  },
});
