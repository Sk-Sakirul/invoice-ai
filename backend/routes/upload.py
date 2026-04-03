from fastapi import APIRouter, UploadFile, File, HTTPException
from config import supabase
from services.ocr_service import extract_text
from services.llm_service import parse_invoice
import uuid

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/")
async def upload_invoice(file: UploadFile = File(...)):

    # 1. Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only JPG, PNG, PDF allowed")

    try:
        print(f"📁 Processing file: {file.filename}")

        # 2. Read file bytes
        file_bytes = await file.read()

        # 3. Validate file size
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(400, "File too large (max 10MB)")

        file_id = str(uuid.uuid4())
        file_path = f"invoices/{file_id}_{file.filename}"

        # 4. Upload to Supabase Storage
        upload_res = supabase.storage.from_("invoices").upload(
            path=file_path,
            file=file_bytes,
            file_options={"content-type": file.content_type}
        )

        # Check upload error
        if hasattr(upload_res, "error") and upload_res.error:
            raise Exception("File upload failed")

        print("✅ File uploaded to Supabase Storage")

        # 5. Get public URL (FIXED VERSION)
        file_url_res = supabase.storage.from_("invoices").get_public_url(file_path)

        # Handle both SDK return types
        if isinstance(file_url_res, dict):
            file_url = file_url_res.get("publicUrl")
        else:
            file_url = file_url_res

        if not file_url:
            raise Exception("Failed to generate public URL")

        print(f"🔗 File URL: {file_url}")

        # 6. Save file metadata
        file_record = supabase.table("invoice_files").insert({
            "file_name": file.filename,
            "file_url": file_url,
            "file_type": file.content_type,
            "status": "processing"
        }).execute()

        if not file_record.data:
            raise Exception("Failed to save file metadata")

        db_file_id = file_record.data[0]["id"]

        print(f"🗂️ DB file ID: {db_file_id}")

        # 7. OCR extraction
        ocr_text = extract_text(file_bytes, file.content_type)

        if not ocr_text:
            raise HTTPException(422, "Could not extract text from file")

        print(f"📝 OCR text length: {len(ocr_text)}")

        # 8. LLM parsing
        extracted = parse_invoice(ocr_text)

        if not extracted:
            raise Exception("LLM parsing failed")

        if not extracted.get("vendor_name"):
            print("⚠️ Warning: Low confidence extraction")

        # 9. Duplicate detection
        is_duplicate = False

        if extracted.get("invoice_number") and extracted.get("vendor_name"):
            dup_check = supabase.table("extracted_invoices") \
                .select("id") \
                .eq("invoice_number", extracted["invoice_number"]) \
                .eq("vendor_name", extracted["vendor_name"]) \
                .execute()

            is_duplicate = len(dup_check.data) > 0

        print(f"🔁 Duplicate: {is_duplicate}")

        # 10. Save extracted data
        insert_res = supabase.table("extracted_invoices").insert({
            "file_id": db_file_id,
            "vendor_name": extracted.get("vendor_name"),
            "invoice_number": extracted.get("invoice_number"),
            "invoice_date": extracted.get("invoice_date"),
            "due_date": extracted.get("due_date"),
            "total_amount": extracted.get("total_amount"),
            "currency": extracted.get("currency"),
            "line_items": extracted.get("line_items", []),
            "raw_json": extracted,
            "confidence_score": extracted.get("confidence_score", 0),
            "is_duplicate": is_duplicate
        }).execute()

        if not insert_res.data:
            raise Exception("Failed to save extracted invoice")

        print("✅ Extracted data saved")

        # 11. Update file status
        supabase.table("invoice_files") \
            .update({"status": "done"}) \
            .eq("id", db_file_id) \
            .execute()

        print("✅ Status updated to done")

        # 12. Final response
        return {
            "success": True,
            "file_id": db_file_id,
            "extracted": extracted,
            "is_duplicate": is_duplicate,
            "ocr_text_length": len(ocr_text)
        }

    except HTTPException:
        raise

    except Exception as e:
        print(f"❌ Error: {str(e)}")

        # Update status to failed
        try:
            supabase.table("invoice_files") \
                .update({"status": "failed"}) \
                .eq("file_name", file.filename) \
                .execute()
        except:
            pass

        raise HTTPException(500, str(e))