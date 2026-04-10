import { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  ViewToken,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const snapEase = Easing.bezier(0.34, 1.56, 0.64, 1);
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { kvSetBool } from '../../lib/database';
import * as Haptics from 'expo-haptics';
import { SeedlingIcon, FlowerIcon, HeartIcon } from '../../components/Common/Icon';
import { t } from '../../lib/i18n';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

function getSlides(): OnboardingSlide[] {
  return [
    {
      id: '1',
      icon: <SeedlingIcon size={80} color={Colors.primary} />,
      title: t('onboarding.slide1Title') as string,
      subtitle: t('onboarding.slide1Sub') as string,
    },
    {
      id: '2',
      icon: <FlowerIcon size={80} color={Colors.accent} />,
      title: t('onboarding.slide2Title') as string,
      subtitle: t('onboarding.slide2Sub') as string,
    },
    {
      id: '3',
      icon: <HeartIcon size={80} color={Colors.accent} />,
      title: t('onboarding.slide3Title') as string,
      subtitle: t('onboarding.slide3Sub') as string,
    },
  ];
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const slides = useMemo(() => getSlides(), []);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await kvSetBool('onboarding_complete', true);
      router.replace('/(app)');
    }
  };

  const buttonScale = useSharedValue(1);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleNextAnimated = async () => {
    buttonScale.value = withSequence(
      withTiming(0.93, { duration: 80, easing: snapEase }),
      withTiming(1, { duration: 160, easing: snapEase })
    );
    await handleNext();
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.iconWrap}>
        {item.icon}
      </Animated.View>
      <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.title}>
        {item.title}
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(400).duration(500)} style={styles.subtitle}>
        {item.subtitle}
      </Animated.Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Button */}
      <AnimatedPressable
        style={[styles.button, buttonAnimStyle]}
        onPress={handleNextAnimated}
      >
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? t('onboarding.start') as string : t('onboarding.next') as string}
        </Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 60,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconWrap: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 26,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  button: {
    marginHorizontal: 40,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
