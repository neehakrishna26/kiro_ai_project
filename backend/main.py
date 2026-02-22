from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    result = random.choice(["Clean", "Stego"])
    confidence = round(random.uniform(0.7, 0.99), 2)

    return {
        "filename": file.filename,
        "prediction": result,
        "confidence": confidence
    }