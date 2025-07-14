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
import logging

# ------------------------
# Logging Configuration
# ------------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ------------------------
# MinIO Configuration
# ------------------------
MINIO_ENDPOINT = "minio:9000"
MINIO_ACCESS_KEY = "minioadmin"
MINIO_SECRET_KEY = "minioadmin"

minio_client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

# ------------------------
# FastAPI App
# ------------------------
app = FastAPI()

# ------------------------
# Load Transformers Models
# ------------------------
logger.info("Loading summarization and classification models...")
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
logger.info("Models loaded successfully.")

# ------------------------
# Pydantic Request Schema
# ------------------------
class AIRequest(BaseModel):
    bucketName: str
    objectName: str

# ------------------------
# Text Extraction Logic
# ------------------------
def extract_text_from_file(filepath: str, ext: str) -> str:
    ext = ext.lower()
    logger.info(f"Extracting text from file: {filepath} (.{ext})")
    try:
        if ext == "pdf":
            with fitz.open(filepath) as doc:
                text = "\n".join([page.get_text() for page in doc])
                logger.info("Text extracted from PDF.")
                return text

        if ext == "docx":
            with open(filepath, "rb") as docx_file:
                result = mammoth.extract_raw_text(docx_file)
                logger.info("Text extracted from DOCX.")
                return result.value

        if ext in ["jpg", "jpeg", "png"]:
            text = pytesseract.image_to_string(Image.open(filepath))
            logger.info("Text extracted from image.")
            return text

        if ext == "txt":
            with open(filepath, "r", encoding="utf-8") as txt_file:
                text = txt_file.read()
                logger.info("Text extracted from TXT.")
                return text

    except Exception as e:
        logger.error(f"Text extraction failed: {e}")
        return ""

    logger.warning("Unsupported file type or no text extracted.")
    return ""

# ------------------------
# Document Processing Endpoint
# ------------------------
@app.post("/process")
def process_document(data: AIRequest):
    logger.info(f"Received request to process document: {data.objectName} from bucket: {data.bucketName}")

    try:
        ext = data.objectName.split(".")[-1]

        # Download file from MinIO
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_file:
            logger.info(f"Downloading {data.objectName} from bucket {data.bucketName}...")
            minio_client.fget_object(data.bucketName, data.objectName, temp_file.name)
            file_path = temp_file.name
            logger.info(f"File downloaded to temporary path: {file_path}")

        # Extract text
        extracted_text = extract_text_from_file(file_path, ext)

        if not extracted_text.strip():
            logger.warning("No text could be extracted from the file.")
            raise Exception("No text extracted from file.")

        # Truncate text to stay within model limits
        input_text = extracted_text[:3000]
        logger.info("Running summarization...")

        summary = summarizer(
            input_text,
            max_length=100,
            min_length=25,
            do_sample=False
        )[0]["summary_text"]
        logger.info("Summarization completed.")

        logger.info("Running classification...")
        classification = classifier(
            input_text,
            candidate_labels=["report", "invoice", "legal", "email", "news", "personal"]
        )
        logger.info("Classification completed.")

        return {
            "summary": summary,
            "labels": classification["labels"],
            "scores": classification["scores"],
        }

    except Exception as e:
        logger.error(f"Processing failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
