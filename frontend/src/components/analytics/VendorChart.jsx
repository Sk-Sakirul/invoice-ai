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

const TooltipBox = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3.5 py-2 text-sm border"
      style={{
        background: "var(--bg3)",
        borderColor: "var(--border2)",
        color: "var(--text)",
      }}
    >
      <p className="mb-0.5" style={{ color: "var(--text2)" }}>
        {payload[0].payload.vendor}
      </p>
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
  const top10 = (data || [])
    .slice(0, 10)
    .map((d) => ({ ...d, shortName: truncate(d.vendor, 14) }));

  return (
    <div
      className="rounded-[14px] p-5 border"
      style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
    >
      <div className="mb-5">
        <p
          className="font-semibold text-[15px] font-head"
          style={{ color: "var(--text)", fontFamily: "var(--font-head)" }}
        >
          Spend by Vendor
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text3)" }}>
          Top {top10.length} vendors by total amount
        </p>
      </div>

      {loading ? (
        <Loader text="Loading vendor data…" />
      ) : top10.length === 0 ? (
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
              content={<TooltipBox />}
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
