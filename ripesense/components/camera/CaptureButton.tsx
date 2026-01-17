/**
 * CaptureButton Component
 * Circular button for capturing photos
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';

interface CaptureButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
  size?: number;
}

export function CaptureButton({ 
  onPress, 
  disabled = false, 
  isProcessing = false,
  size = 72 
}: CaptureButtonProps) {
  
  const handlePress = async () => {
    if (!disabled && !isProcessing) {
      // Trigger haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const outerSize = size;
  const innerSize = size - 8;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isProcessing}
      activeOpacity={0.7}
      style={[
        styles.outerRing,
        { 
          width: outerSize, 
          height: outerSize, 
          borderRadius: outerSize / 2,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.innerCircle,
          { 
            width: innerSize, 
            height: innerSize, 
            borderRadius: innerSize / 2,
          },
        ]}
      >
        {isProcessing && (
          <ActivityIndicator size="small" color="#4CAF50" />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  innerCircle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
