# RipeSense Backend API

FastAPI server for produce ripeness classification using TensorFlow Lite models.

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
.\venv\Scripts\activate  # On Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Add Model Files (Optional)

The backend uses **mock predictions by default** for development. When you have a trained model, add it:

```
models/
├── avocado/
│   └── keras_model.h5      # Keras H5 format
└── banana/
    └── keras_model.h5
```

Then set `use_mock=False` in [main.py](main.py) to use the real model.

### 4. Run the Server

```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check

```bash
GET /
GET /health
```

### Classify Produce

```bash
POST /classify
Content-Type: application/json

{
  "image": "base64_encoded_image_data",
  "produce_type": "avocado"  # or "banana"
}
```

**Response:**

```json
{
  "success": true,
  "produce_type": "avocado",
  "predicted_class": "avocado_ripe1",
  "predicted_label": "Ripe (Stage 1)",
  "confidence": 0.85,
  "all_predictions": [
    {"class_name": "avocado_ripe1", "class_label": "Ripe (Stage 1)", "confidence": 0.85},
    {"class_name": "avocado_ripe2", "class_label": "Ripe (Stage 2)", "confidence": 0.10},
    ...
  ]
}
```

## Testing with curl

```bash
# Health check
curl http://localhost:8000/health

# Classify an image (replace with actual base64 data)
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_image_data_here", "produce_type": "avocado"}'
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Connecting from React Native

For local development on a physical device:

1. Find your computer's local IP: `ipconfig getifaddr en0`
2. Use that IP in your React Native app: `http://192.168.x.x:8000/classify`

For iOS Simulator, you can use `http://localhost:8000`.
