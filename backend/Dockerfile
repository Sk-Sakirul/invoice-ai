FROM python:3.11-slim

# Install tesseract + poppler via apt (works inside Docker)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    poppler-utils \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Verify both are installed — build fails here if missing
RUN tesseract --version && pdftoppm -v

WORKDIR /app

# Copy requirements first (Docker layer cache — faster rebuilds)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app code
COPY . .

# Render injects $PORT — never hardcode 8000 here
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
