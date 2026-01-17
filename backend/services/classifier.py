"""TensorFlow Keras model classifier service.

This service loads Keras models (.h5 or SavedModel format) for produce ripeness classification.
Currently uses mock predictions until real models are added.
"""

import base64
import io
import random
from typing import Optional
from pathlib import Path

import numpy as np
from PIL import Image

# TensorFlow import - will be used when real models are added
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    print("⚠️ TensorFlow not installed - using mock predictions")


# Ripeness class mappings - class names must match frontend RipenessClass types
AVOCADO_CLASSES = {
    0: {"name": "underripe", "label": "Underripe"},
    1: {"name": "breaking", "label": "Breaking"},
    2: {"name": "ripe_stage_1", "label": "Ripe (Stage 1)"},
    3: {"name": "ripe_stage_2", "label": "Ripe (Stage 2)"},
    4: {"name": "overripe", "label": "Overripe"},
}

BANANA_CLASSES = {
    0: {"name": "unripe", "label": "Unripe"},
    1: {"name": "ripe", "label": "Ripe"},
    2: {"name": "overripe", "label": "Overripe"},
}

# Expected input size for Teachable Machine models
MODEL_INPUT_SIZE = (224, 224)


class ProduceClassifier:
    """Classifier for produce ripeness detection using Keras models."""
    
    def __init__(self, models_dir: str = "models", use_mock: bool = True):
        """Initialize the classifier with model directory path.
        
        Args:
            models_dir: Path to directory containing model subdirectories
            use_mock: If True, use mock predictions (for development)
        """
        self.models_dir = Path(models_dir)
        self.models: dict[str, any] = {}
        self.use_mock = use_mock
        self.class_mappings = {
            "avocado": AVOCADO_CLASSES,
            "banana": BANANA_CLASSES,
        }
        
    def load_model(self, produce_type: str) -> bool:
        """Load a Keras model for the specified produce type.
        
        Args:
            produce_type: Type of produce (avocado, banana)
            
        Returns:
            True if model loaded successfully or using mock, False otherwise
        """
        if self.use_mock:
            print(f"🎭 Using mock predictions for {produce_type}")
            self.models[produce_type] = "mock"
            return True
            
        if produce_type in self.models:
            return True
        
        if not TF_AVAILABLE:
            print("TensorFlow not available, falling back to mock")
            self.use_mock = True
            self.models[produce_type] = "mock"
            return True
        
        # Try loading Keras H5 model first, then SavedModel format
        h5_path = self.models_dir / produce_type / "keras_model.h5"
        saved_model_path = self.models_dir / produce_type / "saved_model"
        
        model_path = None
        if h5_path.exists():
            model_path = h5_path
        elif saved_model_path.exists():
            model_path = saved_model_path
        
        if model_path is None:
            print(f"⚠️ No model found for {produce_type}, using mock predictions")
            print(f"   Expected: {h5_path} or {saved_model_path}")
            self.models[produce_type] = "mock"
            return True
            
        try:
            model = tf.keras.models.load_model(str(model_path))
            self.models[produce_type] = model
            print(f"✅ Loaded Keras model for {produce_type} from {model_path}")
            print(f"   Input shape: {model.input_shape}")
            print(f"   Output shape: {model.output_shape}")
            return True
        except Exception as e:
            print(f"❌ Error loading model for {produce_type}: {e}")
            print(f"   Falling back to mock predictions")
            self.models[produce_type] = "mock"
            return True
    
    def preprocess_image(self, image: Image.Image) -> np.ndarray:
        """Preprocess image for model input.
        
        Args:
            image: PIL Image to preprocess
            
        Returns:
            Preprocessed numpy array ready for inference
        """
        # Resize image to model input size (224x224 for Teachable Machine)
        image = image.convert('RGB')
        image = image.resize(MODEL_INPUT_SIZE, Image.Resampling.LANCZOS)
        
        # Convert to numpy array and normalize to [0, 1]
        img_array = np.array(image, dtype=np.float32) / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
    
    def decode_base64_image(self, base64_string: str) -> Image.Image:
        """Decode a base64-encoded image string.
        
        Args:
            base64_string: Base64-encoded image data
            
        Returns:
            PIL Image object
        """
        # Handle data URL format (e.g., "data:image/jpeg;base64,...")
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
            
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        
        return image
    
    def _mock_predict(self, produce_type: str) -> np.ndarray:
        """Generate mock predictions for testing.
        
        Args:
            produce_type: Type of produce
            
        Returns:
            Numpy array of mock confidence scores
        """
        class_mapping = self.class_mappings.get(produce_type, AVOCADO_CLASSES)
        num_classes = len(class_mapping)
        
        # Generate random predictions with one dominant class
        predictions = np.random.random(num_classes).astype(np.float32)
        
        # Make one class dominant (70-95% confidence)
        dominant_idx = random.randint(0, num_classes - 1)
        predictions[dominant_idx] = random.uniform(0.7, 0.95)
        
        # Normalize to sum to 1
        predictions = predictions / predictions.sum()
        
        return predictions
    
    def classify(
        self, 
        image_base64: str, 
        produce_type: str = "avocado"
    ) -> dict:
        """Classify an image of produce.
        
        Args:
            image_base64: Base64-encoded image data
            produce_type: Type of produce to classify
            
        Returns:
            Classification result dictionary
        """
        # Ensure model is loaded
        if not self.load_model(produce_type):
            raise ValueError(f"Model not available for produce type: {produce_type}")
        
        # Decode and preprocess image
        image = self.decode_base64_image(image_base64)
        input_data = self.preprocess_image(image)
        
        # Run inference (or mock)
        model = self.models.get(produce_type)
        
        if model == "mock" or not TF_AVAILABLE:
            predictions = self._mock_predict(produce_type)
        else:
            output = model.predict(input_data, verbose=0)
            predictions = output[0]  # Remove batch dimension
        
        # Get class mapping for this produce type
        class_mapping = self.class_mappings.get(produce_type, {})
        
        # Build predictions list
        all_predictions = []
        for idx, confidence in enumerate(predictions):
            class_info = class_mapping.get(idx, {"name": f"class_{idx}", "label": f"Class {idx}"})
            all_predictions.append({
                "class_name": class_info["name"],
                "class_label": class_info["label"],
                "confidence": float(confidence),
            })
        
        # Sort by confidence (highest first)
        all_predictions.sort(key=lambda x: x["confidence"], reverse=True)
        
        # Get top prediction
        top_prediction = all_predictions[0]
        
        return {
            "success": True,
            "produce_type": produce_type,
            "predicted_class": top_prediction["class_name"],
            "predicted_label": top_prediction["class_label"],
            "confidence": top_prediction["confidence"],
            "all_predictions": all_predictions,
        }


# Singleton instance for use across the app
_classifier: Optional[ProduceClassifier] = None


def get_classifier(use_mock: bool = False) -> ProduceClassifier:
    """Get or create the singleton classifier instance.
    
    Args:
        use_mock: If True, use mock predictions (set False when real model is added)
    """
    global _classifier
    if _classifier is None:
        # Use absolute path relative to this file
        models_dir = Path(__file__).parent.parent / "models"
        _classifier = ProduceClassifier(models_dir=str(models_dir), use_mock=use_mock)
    return _classifier
