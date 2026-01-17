/**
 * RipenessCard Component
 * Displays the ripeness classification result with details
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';

import { ClassificationResult } from '@/types/produce';
import { getRipenessInfo, PRODUCE_CONFIGS } from '@/constants/produce';
import { RipenessIndicator } from './RipenessIndicator';

interface RipenessCardProps {
  result: ClassificationResult;
  imageUri: string;
}

export function RipenessCard({ result, imageUri }: RipenessCardProps) {
  const ripenessInfo = getRipenessInfo(result.produceType, result.ripeness);
  const produceConfig = PRODUCE_CONFIGS[result.produceType];
  
  if (!ripenessInfo) {
    return null;
  }

  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <View style={styles.container}>
      {/* Captured image thumbnail */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          contentFit="cover"
        />
      </View>

      {/* Produce type */}
      <Text style={styles.produceType}>
        {produceConfig.emoji} {produceConfig.displayName}
      </Text>

      {/* Main result */}
      <View style={[styles.resultBadge, { backgroundColor: ripenessInfo.color }]}>
        <Text style={styles.resultEmoji}>{ripenessInfo.emoji}</Text>
        <Text style={styles.resultLabel}>{ripenessInfo.label}</Text>
      </View>

      {/* Confidence */}
      <Text style={styles.confidence}>
        {confidencePercent}% confident
      </Text>

      {/* Ripeness indicator */}
      <RipenessIndicator
        produceType={result.produceType}
        currentStage={ripenessInfo.stage}
      />

      {/* Description */}
      <Text style={styles.description}>
        {ripenessInfo.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  produceType: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 8,
  },
  resultEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  resultLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  confidence: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
  },
});
