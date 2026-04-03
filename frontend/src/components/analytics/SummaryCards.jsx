import { FileText, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

const s = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: 16,
  },
  card: {
    background: "#10131a",
    border: "1px solid #1e2535",
    borderRadius: 14,
    padding: "20px 22px",
    position: "relative",
    overflow: "hidden",
  },
  top: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  label: {
    fontSize: "0.75rem",
    color: "#4a5568",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 500,
  },
  iconWrap: (color) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    background: `${color}18`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  value: {
    fontFamily: "var(--font-head)",
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#e8edf5",
    lineHeight: 1,
  },
  sub: { fontSize: "0.78rem", color: "#4a5568", marginTop: 6 },
  glow: (color) => ({
    position: "absolute",
    bottom: -30,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: `${color}12`,
    filter: "blur(20px)",
    pointerEvents: "none",
  }),
  skel: {
    background: "linear-gradient(90deg,#161b26 25%,#1e2535 50%,#161b26 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
    borderRadius: 6,
  },
};

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
    <div style={s.grid}>
      {CARDS.map(({ key, label, icon: Icon, color, fmt }) => (
        <div key={key} style={s.card} className="fade-in">
          <div style={s.top}>
            <span style={s.label}>{label}</span>
            <div style={s.iconWrap(color)}>
              <Icon size={16} color={color} />
            </div>
          </div>
          {loading ? (
            <div style={{ ...s.skel, height: 32, width: "60%" }} />
          ) : (
            <div style={s.value}>{data ? fmt(data[key] ?? 0) : "—"}</div>
          )}
          {!loading && data && (
            <div style={s.sub}>
              {key === "total_invoices" &&
                `${data.successful_extractions ?? 0} successful extractions`}
              {key === "total_spend" &&
                `across ${(data.currencies_found || []).join(", ") || "all currencies"}`}
              {key === "duplicates_found" &&
                `out of ${data.total_invoices} total`}
              {key === "avg_confidence" && "extraction confidence score"}
            </div>
          )}
          <div style={s.glow(color)} />
        </div>
      ))}
    </div>
  );
}
