/**
 * Home Screen - Camera View
 * Main screen with camera for scanning produce
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { CameraView } from '@/components/camera';
import { useProduceClassifier } from '@/hooks/useProduceClassifier';

export default function HomeScreen() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { isLoading, isModelReady, result, error, loadModel, classifyImage, clearResult } = useProduceClassifier();

  // Load the avocado model on mount (we have this model ready)
  useEffect(() => {
    loadModel('avocado');
  }, [loadModel]);

  // Navigate to results when classification is complete
  useEffect(() => {
    if (result && capturedImage) {
      router.push({
        pathname: '/result',
        params: {
          imageUri: capturedImage,
          resultJson: JSON.stringify(result),
        },
      });
    }
  }, [result, capturedImage]);

  // Handle image capture
  const handleCapture = async (imageUri: string) => {
    setCapturedImage(imageUri);
    clearResult();
    await classifyImage(imageUri);
  };

  // Handle scan again (clear state)
  const handleScanAgain = () => {
    setCapturedImage(null);
    clearResult();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>🥑 RipeSense</Text>
          {!isModelReady && (
            <Text style={styles.loadingText}>Loading model...</Text>
          )}
        </View>
      </SafeAreaView>

      {/* Camera View */}
      <CameraView 
        onCapture={handleCapture}
        isProcessing={isLoading}
      />

      {/* Error message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleScanAgain}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  loadingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});
