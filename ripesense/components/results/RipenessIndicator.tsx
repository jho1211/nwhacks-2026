/**
 * RipenessIndicator Component
 * Visual scale showing all ripeness stages with current stage highlighted
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { ProduceType } from '@/types/produce';
import { PRODUCE_CONFIGS } from '@/constants/produce';

interface RipenessIndicatorProps {
  produceType: ProduceType;
  currentStage: number;
}

export function RipenessIndicator({ produceType, currentStage }: RipenessIndicatorProps) {
  const config = PRODUCE_CONFIGS[produceType];
  const stages = Object.values(config.ripenessInfo);
  
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {stages.map((stage, index) => {
          const isActive = stage.stage === currentStage;
          const isPast = stage.stage < currentStage;
          
          return (
            <View key={stage.label} style={styles.stageContainer}>
              {/* Connector line */}
              {index > 0 && (
                <View 
                  style={[
                    styles.connector,
                    { backgroundColor: isPast || isActive ? stage.color : '#E0E0E0' }
                  ]} 
                />
              )}
              
              {/* Stage dot */}
              <View
                style={[
                  styles.dot,
                  { 
                    backgroundColor: isActive ? stage.color : isPast ? stage.color : '#E0E0E0',
                    transform: [{ scale: isActive ? 1.3 : 1 }],
                  },
                ]}
              >
                {isActive && <View style={styles.activeDotInner} />}
              </View>
              
              {/* Stage label (only show for active) */}
              {isActive && (
                <Text style={[styles.label, { color: stage.color }]}>
                  {stage.label}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connector: {
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  label: {
    position: 'absolute',
    top: 24,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    width: 80,
    marginLeft: -32,
  },
});
