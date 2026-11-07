import React, { useRef, useEffect } from 'react';
import {
  Animated,
  Pressable,
  View,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  Text,
} from 'react-native';

interface BouncyPressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  activeScale?: number;
}

/**
 * Spring-animated pressable giving tactile physical feedback
 */
export const BouncyPressable: React.FC<BouncyPressableProps> = ({
  children,
  onPress,
  disabled = false,
  style,
  className,
  activeScale = 0.96,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: activeScale,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      className={className}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

/**
 * Looping pulse beacon for live clinical updates, sockets, and shortages
 */
export const PulseBeacon: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = '#059669', size = 8 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim, opacityAnim]);

  return (
    <View style={{ width: size * 2, height: size * 2 }} className="items-center justify-center">
      <Animated.View
        style={{
          width: size * 2,
          height: size * 2,
          borderRadius: size,
          backgroundColor: color,
          opacity: opacityAnim,
          transform: [{ scale: pulseAnim }],
          position: 'absolute',
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

/**
 * Smooth pulsing skeleton loader for cards while awaiting network response
 */
export const ShimmerCard: React.FC<{
  height?: number;
  className?: string;
}> = ({ height = 100, className = 'mb-3' }) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={{ opacity: opacityAnim, height }}
      className={`bg-slate-200 rounded-3xl border border-slate-300 ${className}`}
    />
  );
};

/**
 * Loading state wrapper for action buttons
 */
export const ButtonLoadingContent: React.FC<{
  loading: boolean;
  loadingText?: string;
  defaultText: string;
  spinnerColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
}> = ({
  loading,
  loadingText = 'Processing...',
  defaultText,
  spinnerColor = '#ffffff',
  textColor = 'text-white',
  icon,
}) => {
  if (loading) {
    return (
      <View className="flex-row items-center justify-center space-x-2">
        <ActivityIndicator size="small" color={spinnerColor} />
        <Text className={`${textColor} font-black text-xs ml-2 tracking-wide`}>
          {loadingText}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-center">
      {icon ? <View className="mr-1.5">{icon}</View> : null}
      <Text className={`${textColor} font-black text-xs tracking-wide`}>
        {defaultText}
      </Text>
    </View>
  );
};
