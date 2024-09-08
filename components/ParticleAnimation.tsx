import React from 'react';
import { View, Dimensions, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 20;

const ParticleAnimation = () => {
  const particles = Array.from({ length: PARTICLE_COUNT }).map(() => {
    // Shared values for x and y directions
    const translateX = useSharedValue(Math.random() * width);
    const translateY = useSharedValue(Math.random() * height);

    // Randomize direction and speed
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;
    const speedX = Math.random() * 20 + 40; // Random speed between 40 and 60
    const speedY = Math.random() * 20 + 40;

    // Animate the particles
    translateX.value = withRepeat(
      withTiming(translateX.value + directionX * speedX, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      true // Reverse direction
    );

    translateY.value = withRepeat(
      withTiming(translateY.value + directionY * speedY, {
        duration: 5000,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      true // Reverse direction
    );

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    }));

    return <Animated.View key={Math.random()} style={[styles.particle, animatedStyle]} />;
  });

  return <View style={StyleSheet.absoluteFill}>{particles}</View>;
};

const styles = StyleSheet.create({
  particle: {
    top: 1300,
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'purple',
    // Set the glow effect
    shadowColor: 'purple', // Match the particle's color
    shadowOpacity: 1, // Full opacity for a strong glow
    shadowRadius: 100, // Glow radius
    shadowOffset: { width: 20, height:20 }, // Center the shadow around the particle
    elevation: 10, // Add elevation for Android to maintain shadow effect
    // Additional glow for Web (box-shadow)
    ...Platform.select({
      web: {
        boxShadow: '1px 1px 10px purple', // Purple glow effect
      },
    }),
  },
});

export default ParticleAnimation;
