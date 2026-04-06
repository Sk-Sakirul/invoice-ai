import UploadZone from "../components/upload/UploadZone";

const STEPS = ["Upload file", "OCR extraction", "AI parsing", "Saved to DB"];

export default function UploadPage() {
  return (
    <div className="max-w-[900px] mx-auto px-7 py-8 fade-in">
      <div className="mb-8">
        <h2
          className="text-2xl font-extrabold mb-1.5"
          style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
        >
          Upload Invoice
        </h2>
        <p className="text-sm" style={{ color: "var(--text3)" }}>
          Upload a JPG, PNG or PDF invoice and our AI will extract all
          structured data automatically.
        </p>

        {/* Steps */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className="flex items-center gap-2 text-[13px]"
                style={{ color: "var(--text3)" }}
              >
                <span
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    borderColor: "rgba(59,130,246,0.3)",
                    color: "var(--accent)",
                  }}
                >
                  {i + 1}
                </span>
                {step}
              </div>
              {i < STEPS.length - 1 && (
                <span className="text-xs" style={{ color: "var(--border)" }}>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <UploadZone />
    </div>
  );
}
