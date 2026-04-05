FROM python:3.11-slim

# Install tesseract + poppler
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    poppler-utils \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Verify installation (optional but good)
RUN tesseract --version && pdftoppm -v

WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# ✅ FIX: use JSON format + Render PORT
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]