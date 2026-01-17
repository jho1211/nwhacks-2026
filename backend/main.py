"""RipeSense Backend API - FastAPI server for produce ripeness classification."""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas.classification import (
    ClassificationRequest,
    ClassificationResponse,
    ErrorResponse,
)
from services.classifier import get_classifier


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: Initialize classifier with mock mode (no real model yet)
    print("🥑 Initializing RipeSense API...")
    classifier = get_classifier(use_mock=False)
    classifier.load_model("avocado")
    print("✅ API ready! (using mock predictions until model is added)")
    
    yield
    
    # Shutdown
    print("👋 Shutting down RipeSense API...")


app = FastAPI(
    title="RipeSense API",
    description="API for detecting produce ripeness using computer vision",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for mobile app access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your app's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "RipeSense API",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    classifier = get_classifier()
    return {
        "status": "healthy",
        "available_produce_types": ["avocado", "banana"],
    }


@app.post(
    "/classify",
    response_model=ClassificationResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
)
async def classify_produce(request: ClassificationRequest):
    """Classify produce ripeness from an image.
    
    - **image**: Base64-encoded image data (can include data URL prefix)
    - **produce_type**: Type of produce to classify (avocado or banana)
    
    Returns the predicted ripeness class with confidence scores.
    """
    try:
        classifier = get_classifier()
        result = classifier.classify(
            image_base64=request.image,
            produce_type=request.produce_type,
        )
        return ClassificationResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Classification failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
