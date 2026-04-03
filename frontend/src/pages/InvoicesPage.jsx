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

      // ✅ FIXED
      setInvoices(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // 🔍 FILTER + SEARCH
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.vendor_name?.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoice_number?.toLowerCase().includes(search.toLowerCase());

      const matchTab =
        tab === "all" || (tab === "duplicates" && inv.is_duplicate);

      return matchSearch && matchTab;
    });
  }, [invoices, search, tab]);

  const total = invoices.length;
  const duplicates = invoices.filter((i) => i.is_duplicate).length;

  return (
    <div className="p-6 bg-[#0b0f19] min-h-screen text-white">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-gray-400">{total} total invoices</p>
        </div>

        <button
          onClick={loadInvoices}
          className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:border-blue-500 hover:text-blue-500"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#10131a] p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total</p>
          <h2 className="text-xl font-bold">{total}</h2>
        </div>

        <div className="bg-[#10131a] p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Duplicates</p>
          <h2 className="text-xl font-bold text-yellow-400">{duplicates}</h2>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mb-6 flex-col md:flex-row">
        <input
          placeholder="Search invoices..."
          className="flex-1 p-2 rounded bg-[#10131a] border border-gray-700"
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-2 rounded ${
              tab === "all" ? "bg-blue-600" : "bg-[#10131a]"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setTab("duplicates")}
            className={`px-4 py-2 rounded ${
              tab === "duplicates" ? "bg-yellow-500 text-black" : "bg-[#10131a]"
            }`}
          >
            Duplicates
          </button>
        </div>
      </div>

      {/* DATA */}
      {loading ? (
        <Loader text="Loading invoices..." />
      ) : (
        <InvoiceTable invoices={filteredInvoices} />
      )}
    </div>
  );
}
