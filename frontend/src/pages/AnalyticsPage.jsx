import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSummary, getVendorSpend, getMonthlyTrends } from "../api/axios";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [vendor, setVendor] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [s, v, m] = await Promise.all([
        getSummary(),
        getVendorSpend(),
        getMonthlyTrends(),
      ]);

      setSummary(s.data);
      setVendor(v.data);
      setMonthly(m.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-400">Loading analytics...</p>;
  }

  // 🔥 ADVANCED INSIGHTS
  const topVendor = vendor.reduce(
    (prev, curr) => (curr.total > (prev?.total || 0) ? curr : prev),
    null,
  );

  const bestMonth = monthly.reduce(
    (prev, curr) => (curr.total > (prev?.total || 0) ? curr : prev),
    null,
  );

  return (
    <div className="p-6 bg-[#0b0f19] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      {/* INSIGHTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#10131a] p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total Invoices</p>
          <h2 className="text-xl font-bold">{summary.total_invoices}</h2>
        </div>

        <div className="bg-[#10131a] p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Top Vendor</p>
          <h2 className="text-green-400 font-bold">
            {topVendor?.vendor || "-"}
          </h2>
        </div>

        <div className="bg-[#10131a] p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Best Month</p>
          <h2 className="text-purple-400 font-bold">
            {bestMonth?.month || "-"}
          </h2>
        </div>

        <div className="bg-[#10131a] p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Duplicates</p>
          <h2 className="text-yellow-400 font-bold">
            {summary.duplicates_found}
          </h2>
        </div>
      </div>

      {/* BIG CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Vendor */}
        <div className="bg-[#10131a] p-4 rounded-xl">
          <h2 className="mb-4">Vendor Spend</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={vendor}>
              <CartesianGrid stroke="#1e2535" />
              <XAxis dataKey="vendor" stroke="#8b97b0" />
              <YAxis stroke="#8b97b0" />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly */}
        <div className="bg-[#10131a] p-4 rounded-xl">
          <h2 className="mb-4">Monthly Trends</h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthly}>
              <CartesianGrid stroke="#1e2535" />
              <XAxis dataKey="month" stroke="#8b97b0" />
              <YAxis stroke="#8b97b0" />
              <Tooltip />
              <Line dataKey="total" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
