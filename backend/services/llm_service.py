import json
import re
import time
import requests
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# ─── EXTRACTION PROMPT ────────────────────────────────────────────────────────
EXTRACTION_PROMPT = """
You are an expert invoice data extraction system.
Extract structured data from this OCR text of an invoice.

Return ONLY a valid JSON object with EXACTLY these fields:
{{
  "vendor_name": "string or null",
  "invoice_number": "string or null",
  "invoice_date": "YYYY-MM-DD or null",
  "due_date": "YYYY-MM-DD or null",
  "total_amount": number or null,
  "currency": "USD/INR/EUR/GBP or null",
  "subtotal": number or null,
  "tax_amount": number or null,
  "line_items": [
    {{
      "description": "string",
      "quantity": number,
      "unit_price": number,
      "total": number
    }}
  ],
  "billing_address": "string or null",
  "confidence_score": 0.0,
  "missing_fields": ["field_name"]
}}

STRICT RULES:
1. Return ONLY the JSON. No explanation, no markdown, no backticks.
2. confidence_score: 1.0 = all key fields found, 0.5 = partial, 0.0 = nothing found
3. Normalize vendor names: "AMAZON.COM INC" → "Amazon"
4. Parse all date formats to YYYY-MM-DD: "Jan 5 2024" → "2024-01-05"
5. total_amount must be a NUMBER not a string: 1500.00 not "1500.00"
6. Look carefully for: Total / Grand Total / Amount Due / Balance Due
7. If a field truly cannot be found, use null

OCR TEXT:
{ocr_text}
"""


# ─── SAFE JSON PARSER ─────────────────────────────────────────────────────────
def safe_parse_json(raw_text: str) -> dict:
    """Robustly extract JSON from LLM output, handling markdown fences."""
    raw_text = re.sub(r"```json\s*", "", raw_text)
    raw_text = re.sub(r"```\s*",     "", raw_text)
    raw_text = raw_text.strip()

    # Try direct parse first
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        pass

    # Extract first complete {...} block
    match = re.search(r"\{[\s\S]*\}", raw_text)
    if not match:
        raise ValueError("No JSON object found in LLM response")

    json_str = match.group(0)
    # Fix common LLM JSON mistakes
    json_str = re.sub(r",\s*}", "}", json_str)
    json_str = re.sub(r",\s*\]", "]", json_str)

    return json.loads(json_str)


# ─── NORMALIZE NUMERICS ───────────────────────────────────────────────────────
def normalize_numerics(data: dict) -> dict:
    """Ensure numeric fields are floats, not strings."""
    for field in ["total_amount", "subtotal", "tax_amount"]:
        val = data.get(field)
        if val is not None:
            try:
                data[field] = float(str(val).replace(",", "").strip())
            except (ValueError, TypeError):
                data[field] = None

    # Normalize confidence_score → 0.0 to 1.0
    try:
        score = float(data.get("confidence_score", 0.5))
        if score > 1:
            score = score / 100
        data["confidence_score"] = round(max(0.0, min(score, 1.0)), 2)
    except Exception:
        data["confidence_score"] = 0.5

    return data


# ─── FALLBACK (no fake data) ──────────────────────────────────────────────────
def _fallback(error_msg: str) -> dict:
    """
    Returns all-null result on failure.
    Never returns fake vendor names or invoice numbers — that corrupts the DB.
    """
    return {
        "vendor_name":      None,
        "invoice_number":   None,
        "invoice_date":     None,
        "due_date":         None,
        "total_amount":     None,
        "currency":         None,
        "subtotal":         None,
        "tax_amount":       None,
        "line_items":       [],
        "billing_address":  None,
        "confidence_score": 0.0,
        "missing_fields":   ["all"],
        "error":            error_msg,
    }


# ─── MAIN LLM FUNCTION ────────────────────────────────────────────────────────
def parse_invoice(ocr_text: str) -> dict:
    """
    Send OCR text to OpenRouter (GPT-4o-mini) and return structured data.
    Retries up to 3 times with backoff. Handles rate limits.
    """
    if not ocr_text or not ocr_text.strip():
        return _fallback("Empty OCR text passed to LLM")

    if not OPENROUTER_API_KEY:
        return _fallback("OPENROUTER_API_KEY not configured")

    prompt     = EXTRACTION_PROMPT.format(ocr_text=ocr_text[:3000])
    last_error = ""

    for attempt in range(3):
        try:
            print(f"🤖 OpenRouter attempt {attempt + 1}/3")

            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type":  "application/json",
                    "HTTP-Referer":  "https://invoice-ai.app",
                    "X-Title":       "Invoice Extraction AI",
                },
                json={
                    "model":       "openai/gpt-4o-mini",
                    "messages":    [{"role": "user", "content": prompt}],
                    "temperature": 0.1,
                },
                timeout=30,
            )

            if response.status_code == 429:
                print("⏳ Rate limited — waiting 60s...")
                time.sleep(60)
                continue

            if response.status_code != 200:
                last_error = f"API error {response.status_code}: {response.text[:200]}"
                print(f"❌ {last_error}")
                time.sleep(2)
                continue

            result = response.json()

            if "choices" not in result or not result["choices"]:
                raise ValueError("Empty choices in API response")

            raw = result["choices"][0]["message"]["content"].strip()
            print(f"📦 Raw output: {raw[:150]}")

            data = safe_parse_json(raw)
            data = normalize_numerics(data)

            print(f"✅ Extraction done — confidence: {data.get('confidence_score')}")
            return data

        except (json.JSONDecodeError, ValueError) as e:
            last_error = f"JSON parse error: {str(e)}"
            print(f"❌ Attempt {attempt + 1}: {last_error}")
            time.sleep(2)

        except requests.Timeout:
            last_error = "Request timed out"
            print(f"⏱️ Attempt {attempt + 1} timed out")
            time.sleep(3)

        except Exception as e:
            last_error = str(e)
            print(f"❌ Attempt {attempt + 1}: {last_error}")
            time.sleep(2)

    return _fallback(f"All 3 attempts failed. Last error: {last_error}")
