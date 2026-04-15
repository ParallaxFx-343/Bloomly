import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

const SOURCES = {
  sparkle: require('../../assets/lottie/sparkle.json'),
  pollen: require('../../assets/lottie/pollen.json'),
  'glow-pulse': require('../../assets/lottie/glow-pulse.json'),
} as const;

type OverlayType = keyof typeof SOURCES;

interface LottieOverlayProps {
  type: OverlayType;
  visible?: boolean;
  loop?: boolean;
  speed?: number;
}

export const LottieOverlay = React.memo(function LottieOverlay({
  type,
  visible = true,
  loop = true,
  speed = 1,
}: LottieOverlayProps) {
  if (!visible) return null;

  // glow-pulse is one-shot focal animation — use HARDWARE for quality
  // sparkle/pollen are many-instance ambient — use SOFTWARE to save GPU memory
  const renderMode = type === 'glow-pulse' ? 'HARDWARE' : 'SOFTWARE';

  return (
    <View style={styles.overlay} pointerEvents="none">
      <LottieView
        source={SOURCES[type]}
        autoPlay
        loop={loop}
        speed={speed}
        style={styles.lottie}
        renderMode={renderMode}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
