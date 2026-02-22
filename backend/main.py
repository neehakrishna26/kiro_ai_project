from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

app = FastAPI()

# Get allowed origins from environment variable
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        model_path = os.getenv("MODEL_PATH", "model.h5")
        model = tf.keras.models.load_model(model_path)
        print(f"Model loaded successfully from {model_path}")
    except Exception as e:
        print(f"Warning: Could not load model - {str(e)}")
        model = None

@app.get("/")
async def root():
    return {"status": "ok", "message": "Image Analyzer API"}

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    contents = await file.read()
    
    if model is not None:
        try:
            # Preprocess image
            image = Image.open(io.BytesIO(contents))
            if image.mode != "RGB":
                image = image.convert("RGB")
            image = image.resize((224, 224))
            image_array = np.array(image) / 255.0
            image_array = np.expand_dims(image_array, axis=0)
            
            # Get prediction
            prediction_value = model.predict(image_array)[0][0]
            prediction = "stego detected" if prediction_value > 0.5 else "clean image"
            confidence = float(prediction_value if prediction_value > 0.5 else 1 - prediction_value)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    else:
        # Fallback to random if model not loaded
        prediction = "model not loaded"
        confidence = 0.0
    
    return {
        "filename": file.filename,
        "size": len(contents),
        "prediction": prediction,
        "confidence": f"{confidence:.2%}"
    }
