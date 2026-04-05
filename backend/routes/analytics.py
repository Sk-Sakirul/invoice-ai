from fastapi import APIRouter, HTTPException
from config import supabase

router = APIRouter()


@router.get("/summary")
def get_summary():
    try:
        response = supabase.table("extracted_invoices").select("*").execute()
        invoices = response.data or []

        if not invoices:
            return {
                "total_invoices":         0,
                "total_spend":            0.0,
                "avg_confidence":         0.0,
                "duplicates_found":       0,
                "currencies_found":       [],
                "successful_extractions": 0,
            }

        total_spend    = sum((i.get("total_amount")    or 0) for i in invoices)
        total_conf     = sum((i.get("confidence_score") or 0) for i in invoices)
        avg_confidence = total_conf / len(invoices)
        currencies     = sorted({i.get("currency") for i in invoices if i.get("currency")})
        successful     = sum(1 for i in invoices if (i.get("confidence_score") or 0) > 0)

        return {
            "total_invoices":         len(invoices),
            "total_spend":            round(total_spend, 2),
            "avg_confidence":         round(avg_confidence, 2),
            "duplicates_found":       sum(1 for i in invoices if i.get("is_duplicate")),
            "currencies_found":       currencies,
            "successful_extractions": successful,
        }

    except Exception as e:
        raise HTTPException(500, f"Summary error: {str(e)}")


@router.get("/vendor-spend")
def vendor_spend():
    try:
        response = supabase.table("extracted_invoices") \
            .select("vendor_name, total_amount").execute()

        spend: dict = {}
        for inv in response.data or []:
            vendor = inv.get("vendor_name") or "Unknown"
            spend[vendor] = round(spend.get(vendor, 0) + (inv.get("total_amount") or 0), 2)

        result = [{"vendor": k, "total": v} for k, v in spend.items()]
        result.sort(key=lambda x: x["total"], reverse=True)
        return result

    except Exception as e:
        raise HTTPException(500, f"Vendor spend error: {str(e)}")


@router.get("/monthly-trends")
def monthly_trends():
    try:
        response = supabase.table("extracted_invoices") \
            .select("invoice_date, total_amount").execute()

        monthly: dict = {}
        for inv in response.data or []:
            date = inv.get("invoice_date")
            if date:
                month = str(date)[:7]
                monthly[month] = round(monthly.get(month, 0) + (inv.get("total_amount") or 0), 2)

        result = [{"month": k, "total": v} for k, v in monthly.items()]
        result.sort(key=lambda x: x["month"])
        return result

    except Exception as e:
        raise HTTPException(500, f"Monthly trends error: {str(e)}")


@router.get("/currency-breakdown")
def currency_breakdown():
    try:
        response = supabase.table("extracted_invoices") \
            .select("currency, total_amount").execute()

        breakdown: dict = {}
        for inv in response.data or []:
            currency = inv.get("currency") or "Unknown"
            if currency not in breakdown:
                breakdown[currency] = {"currency": currency, "total": 0.0, "count": 0}
            breakdown[currency]["total"]  = round(breakdown[currency]["total"] + (inv.get("total_amount") or 0), 2)
            breakdown[currency]["count"] += 1

        return list(breakdown.values())

    except Exception as e:
        raise HTTPException(500, f"Currency breakdown error: {str(e)}")
