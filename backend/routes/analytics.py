from fastapi import APIRouter, HTTPException
from config import supabase

router = APIRouter()


# ✅ SUMMARY API
@router.get("/summary")
def get_summary():
    try:
        response = supabase.table("extracted_invoices").select("*").execute()
        invoices = response.data or []

        total_spend = sum((i.get("total_amount") or 0) for i in invoices)
        total_conf = sum((i.get("confidence_score") or 0) for i in invoices)

        avg_confidence = total_conf / len(invoices) if invoices else 0

        return {
            "total_invoices": len(invoices),
            "total_spend": round(total_spend, 2),
            "avg_confidence": round(avg_confidence, 2),
            "duplicates_found": sum(1 for i in invoices if i.get("is_duplicate"))
        }

    except Exception as e:
        raise HTTPException(500, f"Summary error: {str(e)}")


# ✅ VENDOR SPEND API
@router.get("/vendor-spend")
def vendor_spend():
    try:
        response = supabase.table("extracted_invoices") \
            .select("vendor_name, total_amount") \
            .execute()

        invoices = response.data or []

        spend = {}

        for inv in invoices:
            vendor = inv.get("vendor_name") or "Unknown"
            amount = inv.get("total_amount") or 0

            spend[vendor] = spend.get(vendor, 0) + amount

        # Convert to sorted list (descending)
        result = [
            {"vendor": k, "total": round(v, 2)}
            for k, v in spend.items()
        ]

        result.sort(key=lambda x: x["total"], reverse=True)

        return result

    except Exception as e:
        raise HTTPException(500, f"Vendor spend error: {str(e)}")


# ✅ MONTHLY TRENDS API
@router.get("/monthly-trends")
def monthly_trends():
    try:
        response = supabase.table("extracted_invoices") \
            .select("invoice_date, total_amount") \
            .execute()

        invoices = response.data or []

        monthly = {}

        for inv in invoices:
            date = inv.get("invoice_date")
            amount = inv.get("total_amount") or 0

            if date:
                month = date[:7]  # YYYY-MM
                monthly[month] = monthly.get(month, 0) + amount

        result = [
            {"month": k, "total": round(v, 2)}
            for k, v in monthly.items()
        ]

        # Sort ascending (for line chart)
        result.sort(key=lambda x: x["month"])

        return result

    except Exception as e:
        raise HTTPException(500, f"Monthly trends error: {str(e)}")