import {
  formatCurrency,
  formatDate,
  confidenceLabel,
} from "../../utils/format";

export default function InvoiceCard({ invoice }) {
  const { label, color } = confidenceLabel(invoice.confidence_score);

  return (
    <div
      className="rounded-xl p-4 border"
      style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold" style={{ color: "var(--text)" }}>
            {invoice.vendor_name || "Unknown"}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>
            {invoice.invoice_number || "—"}
          </p>
        </div>
        {invoice.is_duplicate && (
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "rgba(245,158,11,0.1)",
              color: "#f59e0b",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
          >
            DUP
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text3)" }}>
            Date
          </p>
          <p style={{ color: "var(--text)" }}>
            {formatDate(invoice.invoice_date)}
          </p>
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text3)" }}>
            Amount
          </p>
          <p className="font-semibold" style={{ color: "var(--text)" }}>
            {formatCurrency(invoice.total_amount, invoice.currency)}
          </p>
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text3)" }}>
            Confidence
          </p>
          <p className="font-semibold" style={{ color }}>
            {label}
          </p>
        </div>
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text3)" }}>
            Currency
          </p>
          <p style={{ color: "var(--text)" }}>{invoice.currency || "—"}</p>
        </div>
      </div>
    </div>
  );
}
