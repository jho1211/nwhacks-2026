/**
 * Custom hook for produce classification
 * Manages model loading and classification state
 */

import { useState, useCallback, useEffect } from 'react';
import { ProduceType, ClassificationResult } from '@/types/produce';
import * as Classifier from '@/services/classifier';

interface UseProduceClassifierReturn {
  // State
  isLoading: boolean;
  isModelReady: boolean;
  result: ClassificationResult | null;
  error: string | null;
  
  // Actions
  loadModel: (produceType: ProduceType) => Promise<boolean>;
  classifyImage: (imageUri: string) => Promise<ClassificationResult | null>;
  clearResult: () => void;
}

export function useProduceClassifier(): UseProduceClassifierReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if model is already loaded on mount
  useEffect(() => {
    setIsModelReady(Classifier.isReady());
  }, []);

  /**
   * Load a model for a specific produce type
   */
  const loadModel = useCallback(async (produceType: ProduceType): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await Classifier.loadModel(produceType);
      setIsModelReady(success);
      
      if (!success) {
        setError('Failed to load classification model');
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading model';
      setError(errorMessage);
      setIsModelReady(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Classify an image and get ripeness prediction
   */
  const classifyImage = useCallback(async (imageUri: string): Promise<ClassificationResult | null> => {
    if (!isModelReady) {
      setError('Model not loaded. Please wait for model to load.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const classificationResult = await Classifier.classify(imageUri);
      
      if (classificationResult) {
        setResult(classificationResult);
      } else {
        setError('Classification failed. Please try again.');
      }
      
      return classificationResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during classification';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isModelReady]);

  /**
   * Clear the current result
   */
  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    isModelReady,
    result,
    error,
    loadModel,
    classifyImage,
    clearResult,
  };
}
