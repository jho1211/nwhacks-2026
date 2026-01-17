/**
 * Backend API Classifier Service
 * Sends images to the FastAPI backend for classification
 */

import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { ProduceType, ClassificationResult, PredictionScore, RipenessClass } from '@/types/produce';

// ============================================================
// API CONFIGURATION
// ============================================================
// For physical devices, set your ngrok URL here:
const API_BASE_URL = 'https://5a17eeba374b.ngrok-free.app';

// Model state
let isModelLoaded = false;
let currentProduceType: ProduceType | null = null;

/**
 * Load the model for a specific produce type
 * For backend API, this just sets the current produce type
 */
export async function loadModel(produceType: ProduceType): Promise<boolean> {
  try {
    console.log(`Setting produce type: ${produceType}`);
    
    // Check if backend is reachable
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        console.warn('Backend health check failed, but continuing...');
      } else {
        console.log('Backend is healthy');
      }
    } catch (healthError) {
      console.warn('Could not reach backend, but will try classification anyway:', healthError);
    }
    
    isModelLoaded = true;
    currentProduceType = produceType;
    
    console.log(`Ready to classify ${produceType}`);
    return true;
  } catch (error) {
    console.error('Failed to initialize:', error);
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
 * Convert image to base64 for API
 */
export async function getImageBase64(imageUri: string): Promise<string> {
  try {
    console.log(`Converting image to base64: ${imageUri}`);
    
    // Read the image file as base64
    const base64 = await readAsStringAsync(imageUri, {
      encoding: EncodingType.Base64,
    });
    
    // Return with data URL prefix for backend
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    throw new Error('Failed to convert image to base64');
  }
}

/**
 * Backend API response types
 */
interface BackendPrediction {
  class_name: string;
  class_label: string;
  confidence: number;
}

interface BackendResponse {
  success: boolean;
  produce_type: string;
  predicted_class: string;
  predicted_label: string;
  confidence: number;
  all_predictions: BackendPrediction[];
}

/**
 * Run classification via backend API
 */
export async function classify(imageUri: string): Promise<ClassificationResult | null> {
  if (!isModelLoaded || !currentProduceType) {
    console.error('Not initialized. Call loadModel() first.');
    return null;
  }

  try {
    console.log('Preparing image for classification...');
    
    // Convert image to base64
    const imageBase64 = await getImageBase64(imageUri);
    
    console.log(`Sending image to backend for ${currentProduceType} classification...`);
    
    // Send POST request to backend
    const response = await fetch(`${API_BASE_URL}/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
        produce_type: currentProduceType,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }
    
    const data: BackendResponse = await response.json();
    
    if (!data.success) {
      throw new Error('Classification failed on server');
    }
    
    // Map backend response to our ClassificationResult format
    const predictions: PredictionScore[] = data.all_predictions.map((pred) => ({
      label: pred.class_name as RipenessClass,
      confidence: pred.confidence,
    }));
    
    const result: ClassificationResult = {
      produceType: currentProduceType,
      ripeness: data.predicted_class as RipenessClass,
      confidence: data.confidence,
      allPredictions: predictions,
    };
    
    console.log('Classification result:', result.ripeness, `(${Math.round(result.confidence * 100)}%)`);
    return result;
  } catch (error) {
    console.error('Classification failed:', error);
    throw error;
  }
}

/**
 * Reset the classifier state
 */
export async function unloadModel(): Promise<void> {
  isModelLoaded = false;
  currentProduceType = null;
  console.log('Classifier reset');
}
