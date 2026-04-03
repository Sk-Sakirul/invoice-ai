import pytesseract
import os
from PIL import Image
from pdf2image import convert_from_bytes
import io

# -----------------------------
# 🔧 CONFIGURATION
# -----------------------------

# Set Tesseract path for Windows (local dev)
if os.name == "nt":
    tesseract_path = os.getenv("TESSERACT_PATH")
    if tesseract_path:
        pytesseract.pytesseract.tesseract_cmd = tesseract_path


# -----------------------------
# 🚀 OCR FUNCTION
# -----------------------------
def extract_text(file_bytes: bytes, file_type: str) -> str:
    try:
        text = ""

        print("🔍 Starting OCR process...")

        # -----------------------------
        # 📄 HANDLE PDF FILES
        # -----------------------------
        if file_type == "application/pdf":

            print("📄 Processing PDF file...")

            # Windows → need poppler_path
            if os.name == "nt":
                poppler_path = os.getenv("POPPLER_PATH")

                if not poppler_path:
                    raise Exception(
                        "POPPLER_PATH not set in environment variables (Windows)"
                    )

                pages = convert_from_bytes(
                    file_bytes,
                    dpi=200,
                    poppler_path=poppler_path
                )

            else:
                # Linux (Render) → poppler installed via apt
                pages = convert_from_bytes(file_bytes, dpi=200)

            print(f"📄 Total pages detected: {len(pages)}")

            for i, page in enumerate(pages):
                page_text = pytesseract.image_to_string(page, lang="eng")
                text += page_text + "\n"

                print(f"✅ Processed page {i + 1}")

        # -----------------------------
        # 🖼️ HANDLE IMAGE FILES
        # -----------------------------
        else:
            print("🖼️ Processing image file...")

            image = Image.open(io.BytesIO(file_bytes))
            text = pytesseract.image_to_string(image, lang="eng")

        # -----------------------------
        # 🧹 CLEAN TEXT
        # -----------------------------
        text = text.strip().replace("\n\n", "\n")

        if not text:
            raise Exception("OCR returned empty text")

        print(f"📝 OCR extracted {len(text)} characters")

        return text

    except Exception as e:
        print(f"❌ OCR Error: {str(e)}")
        raise Exception(f"OCR failed: {str(e)}")