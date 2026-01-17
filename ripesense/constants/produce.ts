import {
  ProduceType,
  BananaRipeness,
  AvocadoRipeness,
  RipenessInfo,
  ProduceConfig,
} from '@/types/produce';

/**
 * Banana ripeness information
 */
export const BANANA_RIPENESS_INFO: Record<BananaRipeness, RipenessInfo> = {
  unripe: {
    label: 'Unripe',
    description: 'Very green and firm. Not ready to eat yet. Will need several days to ripen.',
    color: '#4CAF50', // Green
    emoji: '🍃',
    stage: 1,
  },
  ripe: {
    label: 'Ripe',
    description: 'Fully yellow and sweet. Great for eating now or within a day.',
    color: '#FFC107', // Amber
    emoji: '🍌',
    stage: 2,
  },
  overripe: {
    label: 'Overripe',
    description: 'Yellow with brown spots. Very sweet - perfect for baking or smoothies!',
    color: '#FF9800', // Orange
    emoji: '🥧',
    stage: 3,
  },
};

/**
 * Avocado ripeness information
 */
export const AVOCADO_RIPENESS_INFO: Record<AvocadoRipeness, RipenessInfo> = {
  underripe: {
    label: 'Underripe',
    description: 'Hard and bright green. Will need 4-5 days to ripen.',
    color: '#4CAF50', // Green
    emoji: '🪨',
    stage: 1,
  },
  breaking: {
    label: 'Breaking',
    description: 'Starting to soften. Color changing. Ready in 1-2 days.',
    color: '#8BC34A', // Light green
    emoji: '⏳',
    stage: 2,
  },
  ripe_stage_1: {
    label: 'Ripe (Stage 1)',
    description: 'Perfect for eating! Yields slightly to pressure.',
    color: '#2E7D32', // Dark green
    emoji: '🥑',
    stage: 3,
  },
  ripe_stage_2: {
    label: 'Ripe (Stage 2)',
    description: 'Very soft - use immediately! Great for guacamole.',
    color: '#1B5E20', // Darker green
    emoji: '🥑',
    stage: 4,
  },
  overripe: {
    label: 'Overripe',
    description: 'Too soft, likely browning inside. May still have usable parts.',
    color: '#795548', // Brown
    emoji: '😕',
    stage: 5,
  },
};

/**
 * Banana configuration
 */
export const BANANA_CONFIG: ProduceConfig = {
  type: 'banana',
  displayName: 'Banana',
  emoji: '🍌',
  modelPath: 'banana_model.tflite',
  classes: ['unripe', 'ripe', 'overripe'],
  ripenessInfo: BANANA_RIPENESS_INFO,
};

/**
 * Avocado configuration
 */
export const AVOCADO_CONFIG: ProduceConfig = {
  type: 'avocado',
  displayName: 'Avocado',
  emoji: '🥑',
  modelPath: 'avocado_model.tflite',
  classes: ['underripe', 'breaking', 'ripe_stage_1', 'ripe_stage_2', 'overripe'],
  ripenessInfo: AVOCADO_RIPENESS_INFO,
};

/**
 * All produce configurations
 */
export const PRODUCE_CONFIGS: Record<ProduceType, ProduceConfig> = {
  banana: BANANA_CONFIG,
  avocado: AVOCADO_CONFIG,
};

/**
 * Get ripeness info for a specific produce type and ripeness class
 */
export function getRipenessInfo(
  produceType: ProduceType,
  ripeness: string
): RipenessInfo | undefined {
  const config = PRODUCE_CONFIGS[produceType];
  return config?.ripenessInfo[ripeness];
}

/**
 * Model input configuration (Google Teachable Machine defaults)
 */
export const MODEL_INPUT_CONFIG = {
  width: 224,
  height: 224,
  channels: 3,
  normalize: true, // Normalize pixel values to 0-1
};
