from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
from minio import Minio
import os
import tempfile
import mammoth
import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import io

# MinIO config
MINIO_ENDPOINT = "localhost:9000"
MINIO_ACCESS_KEY = "minioadmin"
MINIO_SECRET_KEY = "minioadmin"

minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

app = FastAPI()

# Load models
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
classifier = pipeline("zero-shot-classification")

class AIRequest(BaseModel):
    bucketName: str
    objectName: str

def extract_text_from_file(filepath: str, ext: str) -> str:
    ext = ext.lower()
    try:
        if ext == "pdf":
            with fitz.open(filepath) as doc:
                return "\n".join([page.get_text() for page in doc])

        if ext == "docx":
            with open(filepath, "rb") as docx_file:
                result = mammoth.extract_raw_text(docx_file)
                return result.value

        if ext in ["jpg", "jpeg", "png"]:
            return pytesseract.image_to_string(Image.open(filepath))

        if ext == "txt":
            with open(filepath, "r", encoding="utf-8") as txt_file:
                return txt_file.read()

    except Exception as e:
        print("Text extraction failed:", e)
        return ""

    return ""

@app.post("/process")
def process_document(data: AIRequest):
    try:
        # Download file from MinIO
        ext = data.objectName.split(".")[-1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_file:
            minio_client.fget_object(data.bucketName, data.objectName, temp_file.name)
            file_path = temp_file.name

        # Extract text
        extracted_text = extract_text_from_file(file_path, ext)

        if not extracted_text.strip():
            raise Exception("No text extracted from file.")

        # Truncate for summarizer safety
        input_text = extracted_text[:3000]

        summary = summarizer(
            input_text,
            max_length=100,
            min_length=25,
            do_sample=False
        )[0]["summary_text"]

        classification = classifier(
            input_text,
            candidate_labels=["report", "invoice", "legal", "email", "news", "personal"]
        )

        return {
            "summary": summary,
            "labels": classification["labels"],
            "scores": classification["scores"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
