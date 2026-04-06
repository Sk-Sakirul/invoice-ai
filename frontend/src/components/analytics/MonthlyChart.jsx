import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatMonth } from "../../utils/format";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";

const TooltipBox = ({ active, payload, label }) => {
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
        {formatMonth(label)}
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

export default function MonthlyChart({ data, loading }) {
  const chartData = (data || []).map((d) => ({ ...d, label: d.month }));

  return (
    <div
      className="rounded-[14px] p-5 border"
      style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
    >
      <div className="mb-5">
        <p
          className="font-semibold text-[15px]"
          style={{ color: "var(--text)", fontFamily: "var(--font-head)" }}
        >
          Monthly Spend Trend
        </p>
        <p className="text-[12px] mt-0.5" style={{ color: "var(--text3)" }}>
          Total invoice spend over time
        </p>
      </div>

      {loading ? (
        <Loader text="Loading trends…" />
      ) : chartData.length === 0 ? (
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
            <Tooltip content={<TooltipBox />} />
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
