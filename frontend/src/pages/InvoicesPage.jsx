import { useState, useEffect, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import InvoiceTable from "../components/invoice/InvoiceTable";
import Loader from "../components/common/Loader";
import { getInvoices } from "../api/axios";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await getInvoices();
      setInvoices(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((inv) => {
        const matchSearch =
          inv.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
          inv.invoice_number?.toLowerCase().includes(search.toLowerCase());
        const matchTab =
          tab === "all" || (tab === "duplicates" && inv.is_duplicate);
        return matchSearch && matchTab;
      }),
    [invoices, search, tab],
  );

  const total = invoices.length;
  const duplicates = invoices.filter((i) => i.is_duplicate).length;

  return (
    <div
      className="p-7 fade-in"
      style={{ minHeight: "100vh", background: "var(--bg)" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-3 mb-7">
        <div>
          <h1
            className="text-2xl font-extrabold"
            style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
          >
            Invoices
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text3)" }}>
            {total} total invoices
          </p>
        </div>
        <button
          onClick={loadInvoices}
          className="flex items-center gap-2 px-4 py-2 rounded-[10px] border text-sm transition-all hover:border-[--accent] hover:text-[--accent]"
          style={{ borderColor: "var(--border2)", color: "var(--text2)" }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total", value: total, color: "var(--accent)" },
          { label: "Duplicates", value: duplicates, color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-4 border"
            style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
          >
            <p
              className="text-xs mb-1.5 uppercase tracking-[0.06em]"
              style={{ color: "var(--text3)" }}
            >
              {label}
            </p>
            <p className="text-xl font-bold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1.5 mb-5 border-b pb-0"
        style={{ borderColor: "var(--border)" }}
      >
        {[
          ["all", `All (${total})`],
          ["duplicates", `Duplicates (${duplicates})`],
        ].map(([key, lbl]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="px-4 py-2 text-sm border-b-2 transition-all -mb-px"
            style={{
              fontWeight: tab === key ? 600 : 400,
              borderColor: tab === key ? "var(--accent)" : "transparent",
              color: tab === key ? "var(--accent)" : "var(--text3)",
              background: "transparent",
            }}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          placeholder="Search vendor or invoice number…"
          className="w-full md:w-72 px-4 py-2 rounded-lg border text-sm outline-none"
          style={{
            background: "var(--bg2)",
            borderColor: "var(--border2)",
            color: "var(--text)",
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <Loader text="Loading invoices…" />
      ) : (
        <InvoiceTable
          invoices={filteredInvoices}
          onDeleted={(id) =>
            setInvoices((prev) => prev.filter((i) => i.id !== id))
          }
        />
      )}
    </div>
  );
}
