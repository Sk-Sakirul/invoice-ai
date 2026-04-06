import { useState } from "react";
import { Trash2, ChevronDown, ChevronUp, Search } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  confidenceLabel,
  truncate,
} from "../../utils/format";
import { deleteInvoice } from "../../api/axios";
import EmptyState from "../common/EmptyState";
import InvoiceCard from "./InvoiceCard";

export default function InvoiceTable({ invoices = [], onDeleted }) {
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [deleting, setDeleting] = useState(null);

  const currencies = [
    ...new Set(invoices.map((i) => i.currency).filter(Boolean)),
  ];

  const filtered = invoices
    .filter((inv) => {
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        inv.vendor_name?.toLowerCase().includes(q) ||
        inv.invoice_number?.toLowerCase().includes(q);
      return matchQ && (!currency || inv.currency === currency);
    })
    .sort((a, b) => {
      const av = a[sortBy] ?? "",
        bv = b[sortBy] ?? "";
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });

  const handleSort = (field) => {
    if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    setDeleting(id);
    try {
      await deleteInvoice(id);
      onDeleted?.(id);
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleting(null);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp size={11} />
    ) : (
      <ChevronDown size={11} />
    );
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
    >
      {/* Toolbar */}
      <div
        className="flex flex-wrap gap-3 items-center px-5 py-3.5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="relative flex-1 min-w-[180px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text3)" }}
          />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none border"
            style={{
              background: "var(--bg3)",
              borderColor: "var(--border2)",
              color: "var(--text)",
            }}
            placeholder="Search vendor or invoice #…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 rounded-lg text-sm outline-none border"
          style={{
            background: "var(--bg3)",
            borderColor: "var(--border2)",
            color: "var(--text2)",
          }}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="">All currencies</option>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="text-xs ml-auto" style={{ color: "var(--text3)" }}>
          {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Desktop table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No invoices found"
          subtitle="Try adjusting your filters"
        />
      ) : (
        <>
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead style={{ background: "var(--bg3)" }}>
                <tr>
                  {[
                    ["vendor_name", "Vendor", true],
                    ["invoice_number", "Invoice #", false],
                    ["invoice_date", "Date", true],
                    ["total_amount", "Amount", true],
                    ["currency", "Currency", false],
                    ["confidence_score", "Confidence", true],
                    ["", "Status", false],
                    ["", "", false],
                  ].map(([field, label, sortable]) => (
                    <th
                      key={label}
                      className={`${sortable ? "cursor-pointer select-none" : ""} whitespace-nowrap`}
                      onClick={() => sortable && handleSort(field)}
                    >
                      <span className="flex items-center gap-1">
                        {label}
                        {sortable && <SortIcon field={field} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const { label, color } = confidenceLabel(
                    inv.confidence_score,
                  );
                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="font-semibold">
                        {truncate(inv.vendor_name, 22) || "—"}
                      </td>
                      <td style={{ color: "var(--text2)" }}>
                        {inv.invoice_number || "—"}
                      </td>
                      <td style={{ color: "var(--text2)" }}>
                        {formatDate(inv.invoice_date)}
                      </td>
                      <td className="font-semibold">
                        {formatCurrency(inv.total_amount, inv.currency)}
                      </td>
                      <td style={{ color: "var(--text2)" }}>
                        {inv.currency || "—"}
                      </td>
                      <td>
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full"
                          style={{ color, background: `${color}18` }}
                        >
                          {label} (
                          {Math.round((inv.confidence_score || 0) * 100)}%)
                        </span>
                      </td>
                      <td>
                        {inv.is_duplicate ? (
                          <span
                            className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{
                              color: "#f59e0b",
                              background: "rgba(245,158,11,0.1)",
                            }}
                          >
                            Duplicate
                          </span>
                        ) : (
                          <span
                            className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{
                              color: "#10b981",
                              background: "rgba(16,185,129,0.1)",
                            }}
                          >
                            Unique
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="p-1.5 rounded-md border border-transparent transition-all hover:border-red-500/30 hover:text-red-400 disabled:opacity-40"
                          style={{ color: "var(--text3)" }}
                          disabled={deleting === inv.id}
                          onClick={() => handleDelete(inv.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3 p-4">
            {filtered.map((inv) => (
              <InvoiceCard key={inv.id} invoice={inv} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
