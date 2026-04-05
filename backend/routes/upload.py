from fastapi import APIRouter, UploadFile, File, HTTPException
from config import supabase
from services.ocr_service import extract_text
from services.llm_service import parse_invoice
import uuid

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/", summary="Upload and process an invoice file")
async def upload_invoice(file: UploadFile = File(...)):

    # ── 1. VALIDATE FILE TYPE ─────────────────────────────────────────────────
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file.content_type}'. Allowed: JPG, PNG, PDF"
        )

    db_file_id = None

    try:
        print(f"\n📁 Upload started: {file.filename}")

        # ── 2. READ + SIZE CHECK ──────────────────────────────────────────────
        file_bytes = await file.read()

        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File exceeds 10MB limit")

        # ── 3. UPLOAD TO SUPABASE STORAGE ─────────────────────────────────────
        file_id   = str(uuid.uuid4())
        safe_name = file.filename.replace(" ", "_")
        file_path = f"invoices/{file_id}_{safe_name}"

        upload_res = supabase.storage.from_("invoices").upload(
            path=file_path,
            file=file_bytes,
            file_options={"content-type": file.content_type}
        )

        if hasattr(upload_res, "error") and upload_res.error:
            raise Exception(f"Storage upload failed: {upload_res.error}")

        print(f"✅ Stored: {file_path}")

        # ── 4. GET PUBLIC URL ──────────────────────────────────────────────────
        url_res  = supabase.storage.from_("invoices").get_public_url(file_path)
        file_url = url_res.get("publicUrl") if isinstance(url_res, dict) else url_res

        if not file_url:
            raise Exception("Failed to get public URL from Supabase Storage")

        print(f"🔗 URL: {file_url}")

        # ── 5. SAVE FILE METADATA ─────────────────────────────────────────────
        file_record = supabase.table("invoice_files").insert({
            "file_name": file.filename,
            "file_url":  file_url,
            "file_type": file.content_type,
            "status":    "processing",
        }).execute()

        if not file_record.data:
            raise Exception("Failed to save file metadata to database")

        db_file_id = file_record.data[0]["id"]
        print(f"🗂️  DB ID: {db_file_id}")

        # ── 6. OCR ────────────────────────────────────────────────────────────
        ocr_text = extract_text(file_bytes, file.content_type)

        if not ocr_text:
            raise HTTPException(
                status_code=422,
                detail="Could not extract text — check image quality"
            )

        print(f"📝 OCR: {len(ocr_text)} chars")

        # ── 7. LLM PARSING ────────────────────────────────────────────────────
        extracted = parse_invoice(ocr_text)

        if not extracted:
            raise Exception("LLM returned empty result")

        low_confidence = (extracted.get("confidence_score") or 0) < 0.3
        if low_confidence:
            print("⚠️  Low confidence extraction")

        # ── 8. DUPLICATE DETECTION ────────────────────────────────────────────
        is_duplicate = False
        inv_num = extracted.get("invoice_number")
        vendor  = extracted.get("vendor_name")

        if inv_num and vendor:
            dup = supabase.table("extracted_invoices") \
                .select("id") \
                .eq("invoice_number", inv_num) \
                .eq("vendor_name", vendor) \
                .execute()
            is_duplicate = len(dup.data) > 0

        print(f"🔁 Duplicate: {is_duplicate}")

        # ── 9. SAVE EXTRACTED DATA ────────────────────────────────────────────
        insert_res = supabase.table("extracted_invoices").insert({
            "file_id":          db_file_id,
            "vendor_name":      extracted.get("vendor_name"),
            "invoice_number":   extracted.get("invoice_number"),
            "invoice_date":     extracted.get("invoice_date"),
            "due_date":         extracted.get("due_date"),
            "total_amount":     extracted.get("total_amount"),
            "currency":         extracted.get("currency"),
            "line_items":       extracted.get("line_items", []),
            "raw_json":         extracted,
            "confidence_score": extracted.get("confidence_score", 0),
            "is_duplicate":     is_duplicate,
        }).execute()

        if not insert_res.data:
            raise Exception("Failed to save extracted invoice data")

        # ── 10. MARK FILE DONE ────────────────────────────────────────────────
        supabase.table("invoice_files") \
            .update({"status": "done"}) \
            .eq("id", db_file_id) \
            .execute()

        print(f"✅ Complete: {file.filename}\n")

        return {
            "success":        True,
            "file_id":        db_file_id,
            "file_url":       file_url,
            "extracted":      extracted,
            "is_duplicate":   is_duplicate,
            "low_confidence": low_confidence,
            "ocr_chars":      len(ocr_text),
        }

    except HTTPException:
        _mark_failed(db_file_id)
        raise

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        _mark_failed(db_file_id)
        raise HTTPException(status_code=500, detail=str(e))


def _mark_failed(db_file_id: str | None) -> None:
    """Mark file as failed using primary key — not filename."""
    if not db_file_id:
        return
    try:
        supabase.table("invoice_files") \
            .update({"status": "failed"}) \
            .eq("id", db_file_id) \
            .execute()
    except Exception:
        pass
