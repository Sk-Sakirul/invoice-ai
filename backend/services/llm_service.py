import json
import requests
import os
import re
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# -----------------------------
# 🔥 IMPROVED PROMPT
# -----------------------------
EXTRACTION_PROMPT = """
Extract invoice data and return ONLY valid JSON.

STRICT RULES:
- Return ONLY JSON
- No explanation
- No markdown
- Must start with {{ and end with }}
- If value not found → use null

IMPORTANT:
Look carefully for:
- Total / Grand Total / Amount Due

FORMAT:
{{
  "vendor_name": string or null,
  "invoice_number": string or null,
  "invoice_date": string or null,
  "due_date": string or null,
  "total_amount": number or null,
  "currency": string or null,
  "line_items": [],
  "confidence_score": number
}}

OCR TEXT:
{ocr_text}
"""

# -----------------------------
# 🧹 SAFE JSON PARSER
# -----------------------------
def safe_parse_json(raw_text: str):
    try:
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()

        match = re.search(r"\{[\s\S]*\}", raw_text)
        if match:
            json_str = match.group(0)
        else:
            raise ValueError("No JSON found")

        return json.loads(json_str)

    except Exception as e:
        print("❌ JSON PARSE ERROR:", e)
        print("🔍 RAW OUTPUT:", raw_text[:300])
        return None


# -----------------------------
# 🤖 MAIN FUNCTION
# -----------------------------
def parse_invoice(ocr_text: str) -> dict:
    try:
        prompt = EXTRACTION_PROMPT.format(
            ocr_text=ocr_text[:3000]
        )

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            },
            timeout=30
        )

        result = response.json()

        raw = result["choices"][0]["message"]["content"].strip()

        print("📦 RAW LLM OUTPUT:", raw[:200])

        data = safe_parse_json(raw)

        if not data:
            raise Exception("Invalid JSON from LLM")

        # -----------------------------
        # 🎯 FIX CONFIDENCE SCORE
        # -----------------------------
        if "confidence_score" in data:
            try:
                score = float(data["confidence_score"])

                # Convert 0–100 → 0–1
                if score > 1:
                    score = score / 100

                # Clamp between 0 and 1
                score = max(0, min(score, 1))

                data["confidence_score"] = round(score, 2)

            except Exception:
                data["confidence_score"] = 0.5
        else:
            data["confidence_score"] = 0.5

        return data

    except Exception as e:
        print("❌ LLM Error:", e)

        # -----------------------------
        # 🛟 FALLBACK
        # -----------------------------
        return {
            "vendor_name": "Demo Vendor",
            "invoice_number": "INV-001",
            "invoice_date": None,
            "due_date": None,
            "total_amount": None,
            "currency": None,
            "line_items": [],
            "confidence_score": 0,
            "error": str(e)
        }