import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Image,
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── DROP ZONE ── */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${borderColor}`,
          borderRadius: "var(--radius-lg)",
          padding: "52px 32px",
          textAlign: "center",
          cursor: status === STATES.UPLOADING ? "not-allowed" : "pointer",
          background: isDragActive ? "var(--accent-dim)" : "var(--bg2)",
          transition: "all 0.2s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <input {...getInputProps()} />

        {/* Background grid decoration */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />

        {status === STATES.UPLOADING ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <svg
              width={36}
              height={36}
              viewBox="0 0 24 24"
              fill="none"
              style={{ animation: "spin 0.8s linear infinite" }}
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
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text)",
                }}
              >
                Processing invoice…
              </p>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  marginTop: 4,
                  fontFamily: "DM Mono,monospace",
                }}
              >
                OCR → Gemini AI → Extracting data
              </p>
            </div>
            {/* Progress bar */}
            <div style={{ width: "100%", maxWidth: 280 }}>
              <div
                style={{
                  height: 4,
                  background: "var(--bg3)",
                  borderRadius: 999,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 999,
                    background: "var(--accent)",
                    width: `${progress}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 11,
                  marginTop: 6,
                  fontFamily: "DM Mono,monospace",
                }}
              >
                {progress}%
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: isDragActive ? "var(--accent-dim)" : "var(--bg3)",
                border: `1px solid ${isDragActive ? "var(--accent)" : "var(--border)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <Upload
                size={22}
                color={isDragActive ? "var(--accent)" : "var(--muted)"}
              />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--text)",
                }}
              >
                {isDragActive ? "Drop to extract" : "Drop your invoice here"}
              </p>
              <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>
                or{" "}
                <span
                  style={{
                    color: "var(--accent)",
                    textDecoration: "underline",
                  }}
                >
                  browse files
                </span>
                &nbsp;— JPG, PNG, PDF up to 10MB
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {[
                ["PDF", <FileText size={12} />],
                ["JPG", <Image size={12} />],
                ["PNG", <Image size={12} />],
              ].map(([label, icon]) => (
                <span key={label} className="badge badge-muted">
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── ERROR ── */}
      {status === STATES.ERROR && (
        <div
          className="card fade-up"
          style={{ borderColor: "#ef444430", background: "#ef444408" }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <AlertCircle
              size={18}
              color="var(--red)"
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 600,
                  color: "var(--red)",
                }}
              >
                Extraction failed
              </p>
              <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                {error}
              </p>
            </div>
            <button
              className="btn btn-ghost"
              onClick={reset}
              style={{ fontSize: 12, padding: "6px 12px" }}
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {status === STATES.DONE && result && (
        <div
          className="card fade-up"
          style={{
            borderColor: result.is_duplicate ? "#f5a62340" : "#22c55e30",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle size={18} color="var(--green)" />
              <span
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                Extraction Complete
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {result.is_duplicate && (
                <span className="badge badge-amber">⚠ Duplicate</span>
              )}
              {result.low_confidence && (
                <span className="badge badge-red">Low Confidence</span>
              )}
              <button
                className="btn btn-ghost"
                onClick={reset}
                style={{ fontSize: 12, padding: "6px 12px" }}
              >
                Upload another
              </button>
            </div>
          </div>

          {/* Main fields grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 20,
            }}
          >
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
                style={{
                  background: "var(--bg3)",
                  borderRadius: "var(--radius)",
                  padding: "12px 14px",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    fontFamily: "DM Mono,monospace",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: accent ? "var(--accent)" : "var(--text)",
                    fontFamily: mono ? "DM Mono,monospace" : "Syne,sans-serif",
                  }}
                >
                  {value || "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Confidence */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              padding: "12px 14px",
              background: "var(--bg3)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "var(--muted)",
                fontFamily: "DM Mono,monospace",
                minWidth: 90,
              }}
            >
              CONFIDENCE
            </span>
            <div
              style={{
                flex: 1,
                height: 5,
                background: "var(--border)",
                borderRadius: 999,
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  width: `${(result.extracted?.confidence_score || 0) * 100}%`,
                  background: confidenceColor(
                    result.extracted?.confidence_score || 0,
                  ),
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 13,
                fontFamily: "DM Mono,monospace",
                color: confidenceColor(result.extracted?.confidence_score || 0),
              }}
            >
              {confidenceLabel(result.extracted?.confidence_score || 0)} (
              {((result.extracted?.confidence_score || 0) * 100).toFixed(0)}%)
            </span>
          </div>

          {/* Line items */}
          {result.extracted?.line_items?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  fontFamily: "DM Mono,monospace",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Line Items ({result.extracted.line_items.length})
              </p>
              <div
                className="table-wrap"
                style={{
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                }}
              >
                <table>
                  <thead>
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
                        <td className="mono">{item.quantity ?? "—"}</td>
                        <td className="mono">
                          {formatCurrency(
                            item.unit_price,
                            result.extracted.currency,
                          )}
                        </td>
                        <td className="mono" style={{ color: "var(--text)" }}>
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
              className="btn btn-ghost"
              onClick={() => setShowRaw((v) => !v)}
              style={{
                fontSize: 12,
                padding: "6px 12px",
                marginBottom: showRaw ? 10 : 0,
              }}
            >
              {showRaw ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              Raw JSON
            </button>
            {showRaw && (
              <div style={{ position: "relative" }}>
                <button
                  className="btn btn-ghost"
                  onClick={copyJSON}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    fontSize: 11,
                    padding: "4px 10px",
                    zIndex: 1,
                  }}
                >
                  <Copy size={11} />
                  {copied ? "Copied!" : "Copy"}
                </button>
                <pre
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "16px",
                    fontSize: 12,
                    fontFamily: "DM Mono,monospace",
                    color: "var(--text2)",
                    overflowX: "auto",
                    maxHeight: 360,
                  }}
                >
                  {JSON.stringify(result.extracted, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Meta */}
          <p
            style={{
              marginTop: 12,
              fontSize: 11,
              color: "var(--muted)",
              fontFamily: "DM Mono,monospace",
            }}
          >
            file_id: {result.file_id} · ocr_chars: {result.ocr_chars}
          </p>
        </div>
      )}
    </div>
  );
}