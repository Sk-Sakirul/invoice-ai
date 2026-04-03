import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { formatMonth } from "../../utils/format";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";

const s = {
  wrap: {
    background: "#10131a",
    border: "1px solid #1e2535",
    borderRadius: 14,
    padding: "20px 22px",
  },
  head: { marginBottom: 20 },
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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={s.tooltip}>
      <div style={{ color: "#8b97b0", marginBottom: 2 }}>
        {formatMonth(label)}
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

export default function MonthlyChart({ data, loading }) {
  if (loading)
    return (
      <div style={s.wrap}>
        <Loader text="Loading trends…" />
      </div>
    );

  const chartData = (data || []).map((d) => ({ ...d, label: d.month }));

  return (
    <div style={s.wrap}>
      <div style={s.head}>
        <div style={s.title}>Monthly Spend Trend</div>
        <div style={s.sub}>Total invoice spend over time</div>
      </div>
      {chartData.length === 0 ? (
        <EmptyState
          icon="📈"
          title="No trend data yet"
          subtitle="Upload more invoices to see monthly trends"
        />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, bottom: 4, left: 8 }}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#1e2535"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tickFormatter={formatMonth}
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#areaGrad)"
              dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#60a5fa" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
