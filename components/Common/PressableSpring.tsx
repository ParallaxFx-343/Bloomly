import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export { AnimatedPressable };

const SPRING_IN = { damping: 15, stiffness: 400 };
const SPRING_OUT = { damping: 8, stiffness: 200 };

interface PressableSpringProps extends Omit<PressableProps, 'onPressIn' | 'onPressOut'> {
  scaleIn?: number;
  children: React.ReactNode;
}

export function PressableSpring({
  scaleIn = 0.95,
  style,
  disabled,
  children,
  ...props
}: PressableSpringProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[style, animStyle]}
      onPressIn={() => {
        if (!disabled) scale.value = withSpring(scaleIn, SPRING_IN);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_OUT);
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
