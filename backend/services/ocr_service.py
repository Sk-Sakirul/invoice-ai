import pytesseract
import os
import io
from PIL import Image, ImageEnhance, ImageFilter
from pdf2image import convert_from_bytes

# ─── PLATFORM CONFIG ──────────────────────────────────────────────────────────
# Windows (local): set paths from .env
# Linux/Docker (Render): binaries in system PATH — no config needed
if os.name == "nt":
    tesseract_path = os.getenv("TESSERACT_PATH")
    poppler_path   = os.getenv("POPPLER_PATH")  # e.g. C:\poppler\Library\bin
    if tesseract_path:
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
else:
    # DO NOT hardcode /usr/bin — let pytesseract find via system PATH
    poppler_path = None  # None = pdf2image uses system PATH automatically


# ─── IMAGE PREPROCESSING ──────────────────────────────────────────────────────
def preprocess_image(image: Image.Image) -> Image.Image:
    """Improve OCR accuracy on low-quality or scanned documents."""
    image = image.convert("L")                         # Grayscale
    image = ImageEnhance.Contrast(image).enhance(2.0)  # Boost contrast
    image = image.filter(ImageFilter.SHARPEN)           # Sharpen edges
    return image


# ─── MAIN OCR FUNCTION ────────────────────────────────────────────────────────
def extract_text(file_bytes: bytes, file_type: str) -> str:
    """
    Extract raw text from invoice (PDF or image).
    Works on Windows local dev and Linux/Docker on Render.
    """
    try:
        text = ""
        platform = "Windows" if os.name == "nt" else "Linux/Docker"
        print(f"🔍 OCR starting — type: {file_type}, platform: {platform}")

        # ── PDF ───────────────────────────────────────────────────────────────
        if file_type == "application/pdf":
            print("📄 Converting PDF to images...")

            # Only pass poppler_path on Windows — None on Linux uses system PATH
            convert_kwargs: dict = {"dpi": 200}
            if poppler_path:
                convert_kwargs["poppler_path"] = poppler_path

            pages = convert_from_bytes(file_bytes, **convert_kwargs)
            print(f"📄 Pages found: {len(pages)}")

            for i, page in enumerate(pages):
                page = preprocess_image(page)
                page_text = pytesseract.image_to_string(page, lang="eng")
                text += page_text + "\n"
                print(f"  ✅ Page {i + 1} — {len(page_text)} chars")

        # ── IMAGE (JPG / PNG) ─────────────────────────────────────────────────
        else:
            print("🖼️ Processing image...")
            image = Image.open(io.BytesIO(file_bytes))
            image = preprocess_image(image)
            text = pytesseract.image_to_string(image, lang="eng")

        # ── CLEAN OUTPUT ──────────────────────────────────────────────────────
        lines = [line.strip() for line in text.splitlines()]
        cleaned = "\n".join(line for line in lines if line)

        if not cleaned:
            raise ValueError("OCR returned empty text — check file quality")

        print(f"📝 OCR done — {len(cleaned)} characters")
        return cleaned

    except Exception as e:
        print(f"❌ OCR Error: {str(e)}")
        raise Exception(f"OCR failed: {str(e)}")
