/**
 * TFLite Model Classifier Service
 * Handles loading and running inference with TensorFlow Lite models
 */

import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { ProduceType, ClassificationResult, PredictionScore, RipenessClass } from '@/types/produce';
import { PRODUCE_CONFIGS, MODEL_INPUT_CONFIG } from '@/constants/produce';

// Try to import TFLite - will fail in Expo Go but work in dev builds
let TFLiteModule: any = null;
let tfliteModel: any = null;

try {
  TFLiteModule = require('react-native-tflite');
} catch (e) {
  console.log('TFLite module not available (expected in Expo Go)');
}

// Model state
let isModelLoaded = false;
let currentProduceType: ProduceType | null = null;
let useMockData = true; // Fall back to mock data if TFLite unavailable

/**
 * Label mapping from Teachable Machine output to our internal labels
 * Format from TM: "0 avocado_underripe", "1 avocado_breaking", etc.
 */
const AVOCADO_LABEL_MAP: Record<string, RipenessClass> = {
  'avocado_underripe': 'underripe',
  'avocado_breaking': 'breaking',
  'avocado_ripe1': 'ripe_stage_1',
  'avocado_ripe2': 'ripe_stage_2',
  'avocado_overripe': 'overripe',
};

const BANANA_LABEL_MAP: Record<string, RipenessClass> = {
  'banana_unripe': 'unripe',
  'banana_freshunripe': 'freshunripe',
  'banana_freshripe': 'freshripe',
  'banana_ripe': 'ripe',
  'banana_overripe': 'overripe',
  'banana_rotten': 'rotten',
};

/**
 * Load the TFLite model for a specific produce type
 */
export async function loadModel(produceType: ProduceType): Promise<boolean> {
  try {
    const config = PRODUCE_CONFIGS[produceType];
    console.log(`Loading model for: ${produceType}`);
    
    // Check if TFLite is available
    if (TFLiteModule && TFLiteModule.loadTensorflowModel) {
      try {
        // Load model based on produce type
        if (produceType === 'avocado') {
          tfliteModel = await TFLiteModule.loadTensorflowModel(
            require('@/assets/models/avocado_tflite/model_unquant.tflite')
          );
        } else {
          // Banana model - update path when you have it
          console.log('Banana model not yet available, using mock data');
          useMockData = true;
        }
        
        if (tfliteModel) {
          useMockData = false;
          console.log('TFLite model loaded successfully');
        }
      } catch (modelError) {
        console.warn('Failed to load TFLite model, using mock data:', modelError);
        useMockData = true;
      }
    } else {
      console.log('TFLite not available (Expo Go), using mock data');
      useMockData = true;
    }
    
    isModelLoaded = true;
    currentProduceType = produceType;
    
    console.log(`Model ready for ${produceType} (mock: ${useMockData})`);
    return true;
  } catch (error) {
    console.error('Failed to load model:', error);
    isModelLoaded = false;
    return false;
  }
}

/**
 * Check if a model is currently loaded
 */
export function isReady(): boolean {
  return isModelLoaded;
}

/**
 * Get the currently loaded produce type
 */
export function getCurrentProduceType(): ProduceType | null {
  return currentProduceType;
}

/**
 * Preprocess image for model input
 * Resizes the image to 224x224 as required by Teachable Machine models
 */
export async function preprocessImage(imageUri: string): Promise<string> {
  try {
    console.log(`Preprocessing image: ${imageUri}`);
    
    // Resize image to model input size (224x224 for Teachable Machine)
    const manipulated = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        { resize: { width: MODEL_INPUT_CONFIG.width, height: MODEL_INPUT_CONFIG.height } },
      ],
      { 
        compress: 0.8, 
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );
    
    console.log(`Image resized to ${MODEL_INPUT_CONFIG.width}x${MODEL_INPUT_CONFIG.height}`);
    return manipulated.uri;
  } catch (error) {
    console.error('Failed to preprocess image:', error);
    return imageUri; // Return original if preprocessing fails
  }
}

/**
 * Run inference on an image
 */
export async function classify(imageUri: string): Promise<ClassificationResult | null> {
  if (!isModelLoaded || !currentProduceType) {
    console.error('Model not loaded. Call loadModel() first.');
    return null;
  }

  try {
    const config = PRODUCE_CONFIGS[currentProduceType];
    
    // Preprocess the image
    const processedUri = await preprocessImage(imageUri);
    
    let predictions: PredictionScore[];
    
    if (!useMockData && tfliteModel) {
      // Run actual TFLite inference
      try {
        const output = await tfliteModel.run([processedUri]);
        
        // Parse TFLite output
        const labelMap = currentProduceType === 'avocado' ? AVOCADO_LABEL_MAP : BANANA_LABEL_MAP;
        const outputArray = output[0] as number[];
        
        predictions = Object.entries(labelMap).map(([tmLabel, ourLabel], index) => ({
          label: ourLabel,
          confidence: outputArray[index] || 0,
        }));
      } catch (inferenceError) {
        console.error('TFLite inference failed, falling back to mock:', inferenceError);
        predictions = getMockPredictions(config.classes);
      }
    } else {
      // Use mock data for testing in Expo Go
      predictions = getMockPredictions(config.classes);
    }
    
    // Sort by confidence
    predictions.sort((a, b) => b.confidence - a.confidence);
    
    const result: ClassificationResult = {
      produceType: currentProduceType,
      ripeness: predictions[0].label,
      confidence: predictions[0].confidence,
      allPredictions: predictions,
    };
    
    console.log('Classification result:', result.ripeness, `(${Math.round(result.confidence * 100)}%)`);
    return result;
  } catch (error) {
    console.error('Classification failed:', error);
    return null;
  }
}

/**
 * Generate mock predictions for testing in Expo Go
 */
function getMockPredictions(classes: string[]): PredictionScore[] {
  // Randomly pick a "winning" class
  const winnerIndex = Math.floor(Math.random() * classes.length);
  
  return classes.map((cls, index) => ({
    label: cls as RipenessClass,
    confidence: index === winnerIndex ? 0.7 + Math.random() * 0.25 : Math.random() * 0.15,
  }));
}

/**
 * Unload the current model to free memory
 */
export async function unloadModel(): Promise<void> {
  if (tfliteModel && tfliteModel.dispose) {
    await tfliteModel.dispose();
  }
  tfliteModel = null;
  isModelLoaded = false;
  currentProduceType = null;
  useMockData = true;
  console.log('Model unloaded');
}
