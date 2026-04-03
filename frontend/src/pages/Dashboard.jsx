import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Upload, ArrowRight, RefreshCw } from "lucide-react";
import SummaryCards from "../components/analytics/SummaryCards";
import VendorChart from "../components/analytics/VendorChart";
import MonthlyChart from "../components/analytics/MonthlyChart";
import InvoiceTable from "../components/invoice/InvoiceTable";
import {
  getSummary,
  getVendorSpend,
  getMonthlyTrends,
  getInvoices,
} from "../api/axios";

const s = {
  page: { padding: "32px 28px" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    fontFamily: "var(--font-head)",
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#e8edf5",
  },
  sub: { color: "#4a5568", fontSize: "0.875rem", marginTop: 4 },
  actions: { display: "flex", gap: 10 },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    borderRadius: 10,
    background: "#3b82f6",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.875rem",
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 14px",
    borderRadius: 10,
    background: "transparent",
    border: "1px solid #2a3347",
    color: "#8b97b0",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  section: { marginTop: 28 },
  sectionHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "var(--font-head)",
    fontWeight: 700,
    fontSize: "0.9375rem",
    color: "#e8edf5",
  },
  seeAll: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: "0.8rem",
    color: "#3b82f6",
    textDecoration: "none",
  },
  charts: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  err: {
    background: "rgba(239,68,68,0.05)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#ef4444",
    fontSize: "0.8rem",
    marginBottom: 16,
  },
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [vendor, setVendor] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [s, v, m, i] = await Promise.all([
        getSummary(),
        getVendorSpend(),
        getMonthlyTrends(),
        getInvoices({ limit: 5 }),
      ]);
      setSummary(s.data);
      setVendor(v.data);
      setMonthly(m.data);
      setInvoices(i.data.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={s.page} className="fade-in">
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Dashboard</h2>
          <p style={s.sub}>Your invoice extraction overview</p>
        </div>
        <div style={s.actions}>
          <button
            style={s.refreshBtn}
            onClick={load}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#3b82f6";
              e.currentTarget.style.borderColor = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#8b97b0";
              e.currentTarget.style.borderColor = "#2a3347";
            }}
          >
            <RefreshCw size={13} />
          </button>
          <Link
            to="/upload"
            style={s.uploadBtn}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
          >
            <Upload size={14} /> Upload Invoice
          </Link>
        </div>
      </div>

      {error && <div style={s.err}>⚠ {error}</div>}

      {/* Summary Cards */}
      <SummaryCards data={summary} loading={loading} />

      {/* Charts Row */}
      <div style={s.section}>
        <div
          style={{
            ...s.charts,
            "@media(maxWidth:768px)": { gridTemplateColumns: "1fr" },
          }}
        >
          <VendorChart data={vendor} loading={loading} />
          <MonthlyChart data={monthly} loading={loading} />
        </div>
      </div>

      {/* Recent Invoices */}
      <div style={s.section}>
        <div style={s.sectionHead}>
          <span style={s.sectionTitle}>Recent Invoices</span>
          <Link to="/invoices" style={s.seeAll}>
            View all <ArrowRight size={13} />
          </Link>
        </div>
        <InvoiceTable
          invoices={invoices}
          onDeleted={(id) =>
            setInvoices((prev) => prev.filter((i) => i.id !== id))
          }
        />
      </div>
    </div>
  );
}
