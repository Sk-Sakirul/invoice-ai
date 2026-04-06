import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Upload, ArrowRight, RefreshCw, Clock } from "lucide-react";
import SummaryCards from "../components/analytics/SummaryCards";
import VendorChart from "../components/analytics/VendorChart";
import MonthlyChart from "../components/analytics/MonthlyChart";
import InvoiceTable from "../components/invoice/InvoiceTable";
import EmptyState from "../components/common/EmptyState";
import {
  getSummary,
  getVendorSpend,
  getMonthlyTrends,
  getInvoices,
} from "../api/axios";

const LIMIT_OPTIONS = [5, 10];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [vendor, setVendor] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(5);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [su, v, m, i] = await Promise.all([
        getSummary(),
        getVendorSpend(),
        getMonthlyTrends(),
        getInvoices({ limit: 50 }),
      ]);
      setSummary(su.data);
      setVendor(v.data);
      setMonthly(m.data);
      setAllInvoices(i.data.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const recentInvoices = [...allInvoices]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);

  return (
    <div className="p-7 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-7">
        <div>
          <h2
            className="text-2xl font-extrabold"
            style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
          >
            Dashboard
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text3)" }}>
            Your invoice extraction overview
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={load}
            title="Refresh"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border text-sm transition-all hover:border-[--accent] hover:text-[--accent]"
            style={{
              background: "transparent",
              borderColor: "var(--border2)",
              color: "var(--text2)",
            }}
          >
            <RefreshCw size={13} />
          </button>
          <Link
            to="/upload"
            className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-sm font-semibold text-white transition-colors hover:bg-blue-600"
            style={{ background: "var(--accent)" }}
          >
            <Upload size={14} /> Upload Invoice
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-4 px-4 py-3 rounded-[10px] border text-sm"
          style={{
            background: "rgba(239,68,68,0.05)",
            borderColor: "rgba(239,68,68,0.2)",
            color: "var(--red)",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Summary Cards */}
      <SummaryCards data={summary} loading={loading} />

      {/* Charts */}
      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-4">
        <VendorChart data={vendor} loading={loading} />
        <MonthlyChart data={monthly} loading={loading} />
      </div>

      {/* Recent Invoices */}
      <div className="mt-7">
        <div className="flex items-center justify-between flex-wrap gap-2.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <span
              className="flex items-center gap-1.5 font-bold text-[15px]"
              style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
            >
              <Clock size={15} color="var(--accent)" /> Recent Invoices
            </span>
            <div className="flex gap-1">
              {LIMIT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setLimit(n)}
                  className="px-2.5 py-1 rounded-md text-xs border transition-all"
                  style={{
                    fontWeight: limit === n ? 600 : 400,
                    background:
                      limit === n ? "rgba(59,130,246,0.15)" : "transparent",
                    borderColor:
                      limit === n ? "rgba(59,130,246,0.4)" : "var(--border2)",
                    color: limit === n ? "var(--accent2)" : "var(--text3)",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <Link
            to="/invoices"
            className="flex items-center gap-1 text-[13px] font-medium no-underline"
            style={{ color: "var(--accent)" }}
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {!loading && recentInvoices.length === 0 ? (
          <div
            className="rounded-[14px] border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <EmptyState
              icon="🧾"
              title="No recent invoices"
              subtitle="Upload your first invoice to get started"
            />
          </div>
        ) : (
          <InvoiceTable
            invoices={recentInvoices}
            onDeleted={(id) =>
              setAllInvoices((prev) => prev.filter((i) => i.id !== id))
            }
          />
        )}
      </div>
    </div>
  );
}
