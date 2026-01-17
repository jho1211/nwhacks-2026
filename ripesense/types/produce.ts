/**
 * Produce types and classification interfaces
 */

// Supported produce types
export type ProduceType = 'banana' | 'avocado';

// Banana ripeness classes (6 stages)
export type BananaRipeness =
  | 'unripe'
  | 'ripe'
  | 'overripe'

// Avocado ripeness classes (5 stages)
export type AvocadoRipeness =
  | 'underripe'
  | 'breaking'
  | 'ripe_stage_1'
  | 'ripe_stage_2'
  | 'overripe';

// Union type for all ripeness classifications
export type RipenessClass = BananaRipeness | AvocadoRipeness;

// Classification result from the model
export interface ClassificationResult {
  produceType: ProduceType;
  ripeness: RipenessClass;
  confidence: number; // 0-1 probability
  allPredictions: PredictionScore[];
}

// Individual prediction score
export interface PredictionScore {
  label: RipenessClass;
  confidence: number;
}

// Ripeness metadata for display
export interface RipenessInfo {
  label: string;
  description: string;
  color: string;
  emoji: string;
  stage: number; // 1-6 for banana, 1-5 for avocado
}

// Produce configuration
export interface ProduceConfig {
  type: ProduceType;
  displayName: string;
  emoji: string;
  modelPath: string;
  classes: RipenessClass[];
  ripenessInfo: Record<string, RipenessInfo>;
}
