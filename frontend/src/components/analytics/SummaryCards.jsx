import { FileText, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

const CARDS = [
  {
    key: "total_invoices",
    label: "Total Invoices",
    icon: FileText,
    color: "#3b82f6",
    fmt: (v) => v,
  },
  {
    key: "total_spend",
    label: "Total Spend",
    icon: DollarSign,
    color: "#10b981",
    fmt: (v) =>
      `$${Number(v).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
  },
  {
    key: "duplicates_found",
    label: "Duplicates",
    icon: AlertTriangle,
    color: "#f59e0b",
    fmt: (v) => v,
  },
  {
    key: "avg_confidence",
    label: "Avg Confidence",
    icon: TrendingUp,
    color: "#8b5cf6",
    fmt: (v) => `${Math.round(v * 100)}%`,
  },
];

export default function SummaryCards({ data, loading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon: Icon, color, fmt }) => (
        <div
          key={key}
          className="relative rounded-[14px] p-5 overflow-hidden border fade-in"
          style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between mb-3.5">
            <span
              className="text-[11px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text3)" }}
            >
              {label}
            </span>
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{ background: `${color}18` }}
            >
              <Icon size={16} color={color} />
            </div>
          </div>

          {/* Value */}
          {loading ? (
            <div className="shimmer h-8 w-3/5 rounded-md" />
          ) : (
            <div
              className="text-[1.75rem] font-extrabold leading-none font-head"
              style={{ color: "var(--text)", fontFamily: "var(--font-head)" }}
            >
              {data ? fmt(data[key] ?? 0) : "—"}
            </div>
          )}

          {/* Sub text */}
          {!loading && data && (
            <p className="text-[12px] mt-1.5" style={{ color: "var(--text3)" }}>
              {key === "total_invoices" &&
                `${data.successful_extractions ?? 0} successful extractions`}
              {key === "total_spend" &&
                `across ${(data.currencies_found || []).join(", ") || "all currencies"}`}
              {key === "duplicates_found" &&
                `out of ${data.total_invoices} total`}
              {key === "avg_confidence" && "extraction confidence score"}
            </p>
          )}

          {/* Glow */}
          <div
            className="absolute -bottom-8 -right-5 w-20 h-20 rounded-full pointer-events-none"
            style={{ background: `${color}12`, filter: "blur(20px)" }}
          />
        </div>
      ))}
    </div>
  );
}
