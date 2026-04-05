import pytesseract
import os
from PIL import Image
from pdf2image import convert_from_bytes
import io

# -----------------------------
# 🔧 CONFIGURATION
# -----------------------------

if os.name == "nt":
    # Windows (Local)
    tesseract_path = os.getenv("TESSERACT_PATH")
    poppler_path = os.getenv("POPPLER_PATH")

    if tesseract_path:
        pytesseract.pytesseract.tesseract_cmd = tesseract_path

else:
    # ✅ Linux (Render)
    pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"
    poppler_path = "/usr/bin"


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

            # ✅ ALWAYS pass poppler_path (important fix)
            pages = convert_from_bytes(
                file_bytes,
                dpi=200,
                poppler_path=poppler_path
            )

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