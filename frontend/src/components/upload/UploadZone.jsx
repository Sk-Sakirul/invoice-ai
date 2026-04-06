import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { uploadInvoice } from "../../api/axios";
import {
  formatCurrency,
  formatDate,
  confidenceColor,
  confidenceLabel,
} from "../../utils/format";

const STATES = {
  IDLE: "idle",
  UPLOADING: "uploading",
  DONE: "done",
  ERROR: "error",
};

export default function UploadZone() {
  const [status, setStatus] = useState(STATES.IDLE);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  const onDrop = useCallback(async (accepted) => {
    if (!accepted.length) return;
    const file = accepted[0];
    setStatus(STATES.UPLOADING);
    setProgress(0);
    setResult(null);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await uploadInvoice(formData, setProgress);
      setResult(res.data);
      setStatus(STATES.DONE);
    } catch (err) {
      setError(err.message);
      setStatus(STATES.ERROR);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "image/jpeg": [], "image/png": [], "application/pdf": [] },
      maxFiles: 1,
      disabled: status === STATES.UPLOADING,
    });

  const reset = () => {
    setStatus(STATES.IDLE);
    setResult(null);
    setError("");
  };
  const copyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(result?.extracted, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const borderColor = isDragReject
    ? "var(--red)"
    : isDragActive
      ? "var(--accent)"
      : status === STATES.DONE
        ? "var(--green)"
        : "var(--border2)";

  return (
    <div className="flex flex-col gap-6">
      {/* ── Drop Zone ── */}
      <div
        {...getRootProps()}
        className="relative rounded-[14px] text-center overflow-hidden transition-all duration-200"
        style={{
          border: `2px dashed ${borderColor}`,
          padding: "52px 32px",
          cursor: status === STATES.UPLOADING ? "not-allowed" : "pointer",
          background: isDragActive ? "var(--accent-dim)" : "var(--bg2)",
        }}
      >
        <input {...getInputProps()} />

        {/* Grid decoration */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--text) 1px,transparent 1px),linear-gradient(90deg,var(--text) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {status === STATES.UPLOADING ? (
          <div className="flex flex-col items-center gap-4">
            <svg
              width={36}
              height={36}
              viewBox="0 0 24 24"
              fill="none"
              className="spinner"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="var(--border2)"
                strokeWidth="2"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <p
                className="font-bold text-base"
                style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
              >
                Processing invoice…
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                OCR → AI → Extracting data
              </p>
            </div>
            <div className="w-full max-w-[280px]">
              <div
                className="h-1 rounded-full"
                style={{ background: "var(--bg3)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: "var(--accent)" }}
                />
              </div>
              <p
                className="text-[11px] text-right mt-1.5"
                style={{ color: "var(--muted)" }}
              >
                {progress}%
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-200"
              style={{
                background: isDragActive ? "var(--accent-dim)" : "var(--bg3)",
                borderColor: isDragActive ? "var(--accent)" : "var(--border)",
              }}
            >
              <Upload
                size={22}
                color={isDragActive ? "var(--accent)" : "var(--muted)"}
              />
            </div>
            <div>
              <p
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
              >
                {isDragActive ? "Drop to extract" : "Drop your invoice here"}
              </p>
              <p className="text-sm mt-1.5" style={{ color: "var(--muted)" }}>
                or{" "}
                <span className="underline" style={{ color: "var(--accent)" }}>
                  browse files
                </span>{" "}
                — JPG, PNG, PDF up to 10MB
              </p>
            </div>
            <div className="flex gap-2 mt-1">
              {["PDF", "JPG", "PNG"].map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2.5 py-0.5 rounded-full border"
                  style={{
                    background: "var(--bg3)",
                    borderColor: "var(--border2)",
                    color: "var(--text2)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {status === STATES.ERROR && (
        <div
          className="rounded-[14px] p-4 border fade-in"
          style={{
            background: "rgba(239,68,68,0.05)",
            borderColor: "rgba(239,68,68,0.2)",
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={18}
              color="var(--red)"
              className="shrink-0 mt-0.5"
            />
            <div className="flex-1">
              <p
                className="font-semibold"
                style={{ fontFamily: "var(--font-head)", color: "var(--red)" }}
              >
                Extraction failed
              </p>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                {error}
              </p>
            </div>
            <button
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:border-[--accent] hover:text-[--accent]"
              style={{ color: "var(--text2)", borderColor: "var(--border2)" }}
              onClick={reset}
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Result ── */}
      {status === STATES.DONE && result && (
        <div
          className="rounded-[14px] border fade-in overflow-hidden"
          style={{
            background: "var(--bg2)",
            borderColor: result.is_duplicate
              ? "rgba(245,163,35,0.3)"
              : "rgba(34,197,94,0.2)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle size={18} color="var(--green)" />
              <span
                className="font-bold text-base"
                style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
              >
                Extraction Complete
              </span>
            </div>
            <div className="flex items-center gap-2">
              {result.is_duplicate && (
                <span
                  className="text-[11px] px-2.5 py-0.5 rounded-full border font-medium"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    borderColor: "rgba(245,158,11,0.3)",
                    color: "#f59e0b",
                  }}
                >
                  ⚠ Duplicate
                </span>
              )}
              {result.low_confidence && (
                <span
                  className="text-[11px] px-2.5 py-0.5 rounded-full border font-medium"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    borderColor: "rgba(239,68,68,0.3)",
                    color: "var(--red)",
                  }}
                >
                  Low Confidence
                </span>
              )}
              <button
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:border-[--accent] hover:text-[--accent]"
                style={{ color: "var(--text2)", borderColor: "var(--border2)" }}
                onClick={reset}
              >
                Upload another
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Fields grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Vendor", value: result.extracted?.vendor_name },
                {
                  label: "Invoice #",
                  value: result.extracted?.invoice_number,
                  mono: true,
                },
                {
                  label: "Date",
                  value: formatDate(result.extracted?.invoice_date),
                },
                {
                  label: "Due Date",
                  value: formatDate(result.extracted?.due_date),
                },
                {
                  label: "Total",
                  value: formatCurrency(
                    result.extracted?.total_amount,
                    result.extracted?.currency,
                  ),
                  accent: true,
                },
                { label: "Currency", value: result.extracted?.currency },
                {
                  label: "Tax",
                  value: formatCurrency(
                    result.extracted?.tax_amount,
                    result.extracted?.currency,
                  ),
                },
                {
                  label: "Subtotal",
                  value: formatCurrency(
                    result.extracted?.subtotal,
                    result.extracted?.currency,
                  ),
                },
              ].map(({ label, value, mono, accent }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 border"
                  style={{
                    background: "var(--bg3)",
                    borderColor: "var(--border)",
                  }}
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.06em] mb-1"
                    style={{ color: "var(--muted)" }}
                  >
                    {label}
                  </p>
                  <p
                    className={`text-sm font-semibold ${mono ? "font-mono" : ""}`}
                    style={{ color: accent ? "var(--accent)" : "var(--text)" }}
                  >
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>

            {/* Confidence bar */}
            <div
              className="flex items-center gap-3 rounded-xl p-3 border"
              style={{ background: "var(--bg3)", borderColor: "var(--border)" }}
            >
              <span
                className="text-[11px] font-mono min-w-[90px]"
                style={{ color: "var(--muted)" }}
              >
                CONFIDENCE
              </span>
              <div
                className="flex-1 h-[5px] rounded-full"
                style={{ background: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(result.extracted?.confidence_score || 0) * 100}%`,
                    background: confidenceColor(
                      result.extracted?.confidence_score || 0,
                    ),
                  }}
                />
              </div>
              <span
                className="text-[13px] font-mono"
                style={{
                  color: confidenceColor(
                    result.extracted?.confidence_score || 0,
                  ),
                }}
              >
                {confidenceLabel(result.extracted?.confidence_score || 0)} (
                {((result.extracted?.confidence_score || 0) * 100).toFixed(0)}%)
              </span>
            </div>

            {/* Line items */}
            {result.extracted?.line_items?.length > 0 && (
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.06em] mb-2.5"
                  style={{ color: "var(--muted)" }}
                >
                  Line Items ({result.extracted.line_items.length})
                </p>
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{ borderColor: "var(--border)" }}
                >
                  <table>
                    <thead style={{ background: "var(--bg3)" }}>
                      <tr>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.extracted.line_items.map((item, i) => (
                        <tr key={i}>
                          <td>{item.description || "—"}</td>
                          <td className="font-mono">{item.quantity ?? "—"}</td>
                          <td className="font-mono">
                            {formatCurrency(
                              item.unit_price,
                              result.extracted.currency,
                            )}
                          </td>
                          <td className="font-mono">
                            {formatCurrency(
                              item.total,
                              result.extracted.currency,
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Raw JSON toggle */}
            <div>
              <button
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors hover:text-[--accent] hover:border-[--accent]"
                style={{ color: "var(--text2)", borderColor: "var(--border2)" }}
                onClick={() => setShowRaw((v) => !v)}
              >
                {showRaw ? <ChevronUp size={13} /> : <ChevronDown size={13} />}{" "}
                Raw JSON
              </button>
              {showRaw && (
                <div className="relative mt-2.5">
                  <button
                    className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md border transition-colors hover:text-[--accent]"
                    style={{
                      color: "var(--text2)",
                      background: "var(--bg3)",
                      borderColor: "var(--border2)",
                    }}
                    onClick={copyJSON}
                  >
                    <Copy size={11} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <pre
                    className="rounded-xl border overflow-auto max-h-80 text-[12px] font-mono p-4"
                    style={{
                      background: "var(--bg)",
                      borderColor: "var(--border)",
                      color: "var(--text2)",
                    }}
                  >
                    {JSON.stringify(result.extracted, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <p
              className="text-[11px] font-mono"
              style={{ color: "var(--muted)" }}
            >
              file_id: {result.file_id} · ocr_chars: {result.ocr_chars}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
