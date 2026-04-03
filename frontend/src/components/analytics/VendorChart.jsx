import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { truncate } from "../../utils/format";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#60a5fa",
  "#a78bfa",
  "#34d399",
];

const s = {
  wrap: {
    background: "#10131a",
    border: "1px solid #1e2535",
    borderRadius: 14,
    padding: "20px 22px",
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontFamily: "var(--font-head)",
    fontWeight: 700,
    fontSize: "0.9375rem",
    color: "#e8edf5",
  },
  sub: { fontSize: "0.78rem", color: "#4a5568", marginTop: 2 },
  tooltip: {
    background: "#161b26",
    border: "1px solid #2a3347",
    borderRadius: 8,
    padding: "8px 14px",
    fontSize: "0.8rem",
    color: "#e8edf5",
  },
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={s.tooltip}>
      <div style={{ color: "#8b97b0", marginBottom: 2 }}>
        {payload[0].payload.vendor}
      </div>
      <strong>
        $
        {Number(payload[0].value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}
      </strong>
    </div>
  );
};

export default function VendorChart({ data, loading }) {
  if (loading)
    return (
      <div style={s.wrap}>
        <Loader text="Loading vendor data…" />
      </div>
    );

  const top10 = (data || [])
    .slice(0, 10)
    .map((d) => ({ ...d, shortName: truncate(d.vendor, 14) }));

  return (
    <div style={s.wrap}>
      <div style={s.head}>
        <div>
          <div style={s.title}>Spend by Vendor</div>
          <div style={s.sub}>
            Top {top10.length} vendors by total invoice amount
          </div>
        </div>
      </div>
      {top10.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No vendor data yet"
          subtitle="Upload invoices to see spend breakdown"
        />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={top10}
            margin={{ top: 4, right: 4, bottom: 4, left: 8 }}
          >
            <XAxis
              dataKey="shortName"
              tick={{ fill: "#4a5568", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#4a5568", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(59,130,246,0.05)" }}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {top10.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
