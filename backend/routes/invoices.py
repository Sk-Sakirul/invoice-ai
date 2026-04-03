from fastapi import APIRouter, HTTPException, Query
from config import supabase

router = APIRouter()


# ✅ 1. GET ALL INVOICES (with filters)
@router.get("/")
def get_invoices(
    vendor: str = Query(None),
    currency: str = Query(None),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    try:
        query = supabase.table("extracted_invoices").select("*")

        if vendor:
            query = query.ilike("vendor_name", f"%{vendor}%")

        if currency:
            query = query.eq("currency", currency)

        if start_date:
            query = query.gte("invoice_date", start_date)

        if end_date:
            query = query.lte("invoice_date", end_date)

        response = query.order("created_at", desc=True).execute()

        return {
            "count": len(response.data or []),
            "data": response.data or []
        }

    except Exception as e:
        raise HTTPException(500, f"Fetch invoices failed: {str(e)}")


# ✅ 2. GET SINGLE INVOICE BY ID
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

    except Exception as e:
        raise HTTPException(500, f"Get invoice failed: {str(e)}")


# ✅ 3. UPDATE INVOICE (Manual correction feature 🔥)
@router.put("/{invoice_id}")
def update_invoice(invoice_id: str, payload: dict):
    try:
        update_res = supabase.table("extracted_invoices") \
            .update(payload) \
            .eq("id", invoice_id) \
            .execute()

        if not update_res.data:
            raise HTTPException(404, "Invoice not found or update failed")

        return {
            "success": True,
            "updated": update_res.data[0]
        }

    except Exception as e:
        raise HTTPException(500, f"Update failed: {str(e)}")


# ✅ 4. DELETE INVOICE
@router.delete("/{invoice_id}")
def delete_invoice(invoice_id: str):
    try:
        delete_res = supabase.table("extracted_invoices") \
            .delete() \
            .eq("id", invoice_id) \
            .execute()

        if not delete_res.data:
            raise HTTPException(404, "Invoice not found")

        return {
            "success": True,
            "deleted_id": invoice_id
        }

    except Exception as e:
        raise HTTPException(500, f"Delete failed: {str(e)}")


# ✅ 5. GET DUPLICATE INVOICES (bonus feature)
@router.get("/duplicates/all")
def get_duplicates():
    try:
        response = supabase.table("extracted_invoices") \
            .select("*") \
            .eq("is_duplicate", True) \
            .execute()

        return {
            "count": len(response.data or []),
            "data": response.data or []
        }

    except Exception as e:
        raise HTTPException(500, f"Duplicate fetch failed: {str(e)}")