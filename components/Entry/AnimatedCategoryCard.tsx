import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { Colors } from '../../constants/Colors';
import { Category, CategoryId } from '../../constants/Categories';
import { CATEGORY_ICONS } from '../Common/Icon';

const snapEase = Easing.bezier(0.34, 1.56, 0.64, 1);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedCategoryCardProps {
  category: Category;
  isSelected: boolean;
  onPress: (id: CategoryId) => void;
}

export const AnimatedCategoryCard = React.memo(function AnimatedCategoryCard({
  category,
  isSelected,
  onPress,
}: AnimatedCategoryCardProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    return () => cancelAnimation(scale);
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withTiming(0.92, { duration: 80, easing: snapEase }),
      withTiming(1, { duration: 160, easing: snapEase })
    );
    onPress(category.id);
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const IconComponent = CATEGORY_ICONS[category.id];

  return (
    <AnimatedPressable
      style={[
        styles.card,
        {
          borderColor: isSelected ? category.color : colors.border,
          backgroundColor: isSelected ? category.color + '20' : colors.card,
          borderWidth: isSelected ? 2.5 : 1,
        },
        animStyle,
      ]}
      onPress={handlePress}
    >
      {IconComponent && <IconComponent size={30} color={category.color} />}
      <Text
        style={[
          styles.label,
          { color: colors.textLight },
          isSelected && { color: colors.text, fontWeight: '700' },
        ]}
      >
        {category.label}
      </Text>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '29%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500',
  },
});
