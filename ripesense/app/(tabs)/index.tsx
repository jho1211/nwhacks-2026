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
import { ProduceType } from '@/types/produce';

export default function HomeScreen() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedProduce, setSelectedProduce] = useState<ProduceType>('avocado');
  const { isLoading, isModelReady, result, error, loadModel, classifyImage, clearResult } = useProduceClassifier();

  // Load the selected produce model on mount and when selection changes
  useEffect(() => {
    loadModel(selectedProduce);
  }, [selectedProduce, loadModel]);

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

  // Toggle between produce types
  const toggleProduceType = () => {
    setSelectedProduce(prev => prev === 'avocado' ? 'banana' : 'avocado');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logo}>
            {selectedProduce === 'avocado' ? '🥑' : '🍌'} RipeSense
          </Text>
          {!isModelReady && (
            <Text style={styles.loadingText}>Loading...</Text>
          )}
        </View>
      </SafeAreaView>

      {/* Produce Type Selector */}
      <View style={styles.selectorContainer}>
        <TouchableOpacity 
          style={styles.selector}
          onPress={toggleProduceType}
          activeOpacity={0.8}
        >
          <TouchableOpacity
            style={[
              styles.selectorOption,
              selectedProduce === 'avocado' && styles.selectorOptionActive,
            ]}
            onPress={() => setSelectedProduce('avocado')}
          >
            <Text style={[
              styles.selectorText,
              selectedProduce === 'avocado' && styles.selectorTextActive,
            ]}>
              🥑 Avocado
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectorOption,
              selectedProduce === 'banana' && styles.selectorOptionActive,
            ]}
            onPress={() => setSelectedProduce('banana')}
          >
            <Text style={[
              styles.selectorText,
              selectedProduce === 'banana' && styles.selectorTextActive,
            ]}>
              🍌 Banana
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

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
  selectorContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 10,
    alignItems: 'center',
  },
  selector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    padding: 4,
  },
  selectorOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  selectorOptionActive: {
    backgroundColor: '#fff',
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  selectorTextActive: {
    color: '#000',
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
