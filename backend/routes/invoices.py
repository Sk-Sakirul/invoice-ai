from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from config import supabase

router = APIRouter()

_PROTECTED = {"id", "file_id", "created_at", "is_duplicate"}


# ── GET ALL INVOICES ──────────────────────────────────────────────────────────
@router.get("/")
def get_invoices(
    vendor:     Optional[str] = Query(None),
    currency:   Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date:   Optional[str] = Query(None),
    limit:      int           = Query(50, ge=1, le=200),
):
    try:
        query = supabase.table("extracted_invoices").select("*")

        if vendor:
            query = query.ilike("vendor_name", f"%{vendor}%")
        if currency:
            query = query.eq("currency", currency.upper())
        if start_date:
            query = query.gte("invoice_date", start_date)
        if end_date:
            query = query.lte("invoice_date", end_date)

        response = query.order("created_at", desc=True).limit(limit).execute()
        return {"count": len(response.data or []), "data": response.data or []}

    except Exception as e:
        raise HTTPException(500, f"Fetch invoices failed: {str(e)}")


# ── GET DUPLICATES ────────────────────────────────────────────────────────────
# ⚠️ MUST be defined BEFORE /{invoice_id} — otherwise FastAPI matches
# "duplicates" as an invoice_id and returns a 500 error
@router.get("/duplicates/all")
def get_duplicates():
    try:
        response = supabase.table("extracted_invoices") \
            .select("*") \
            .eq("is_duplicate", True) \
            .order("created_at", desc=True) \
            .execute()
        return {"count": len(response.data or []), "data": response.data or []}
    except Exception as e:
        raise HTTPException(500, f"Duplicate fetch failed: {str(e)}")


# ── GET SINGLE INVOICE ────────────────────────────────────────────────────────
@router.get("/{invoice_id}")
def get_invoice(invoice_id: str):
    try:
        response = supabase.table("extracted_invoices") \
            .select("*") \
            .eq("id", invoice_id) \
            .single() \
            .execute()

        if not response.data:
            raise HTTPException(404, "Invoice not found")

        return response.data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Get invoice failed: {str(e)}")


# ── UPDATE INVOICE ────────────────────────────────────────────────────────────
@router.put("/{invoice_id}")
def update_invoice(invoice_id: str, payload: dict):
    invalid = _PROTECTED.intersection(payload.keys())
    if invalid:
        raise HTTPException(400, f"Cannot update protected fields: {sorted(invalid)}")

    try:
        res = supabase.table("extracted_invoices") \
            .update(payload) \
            .eq("id", invoice_id) \
            .execute()

        if not res.data:
            raise HTTPException(404, "Invoice not found")

        return {"success": True, "updated": res.data[0]}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Update failed: {str(e)}")


# ── DELETE INVOICE ────────────────────────────────────────────────────────────
@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: str):
    try:
        res = supabase.table("extracted_invoices") \
            .delete() \
            .eq("id", invoice_id) \
            .execute()

        if not res.data:
            raise HTTPException(404, "Invoice not found")

        return {"success": True, "deleted_id": invoice_id}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Delete failed: {str(e)}")
