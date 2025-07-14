# Use official slim Python image (lightweight base)
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Disable interactive prompts during apt installs
ENV DEBIAN_FRONTEND=noninteractive

# Install required system packages:
# - tesseract-ocr: for OCR
# - poppler-utils & libpoppler: for PDF processing
# - libglib, libgl: for image rendering
# - build-essential, python3-dev: for compiling Python packages
# - libjpeg, zlib: for image processing
# - curl: optional utility
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libglib2.0-0 \
    libgl1-mesa-glx \
    build-essential \
    python3-dev \
    libjpeg-dev \
    zlib1g-dev \
    libpoppler-cpp-dev \
    curl \
    && apt-get clean

# Install PyTorch (CPU version) before other Python packages
# Using official PyTorch index for CPU wheels
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Copy Python dependency file
COPY requirements.txt .

# Install other Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code into container
COPY . .

# Expose FastAPI port
EXPOSE 8001

# Run FastAPI app with Uvicorn server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
