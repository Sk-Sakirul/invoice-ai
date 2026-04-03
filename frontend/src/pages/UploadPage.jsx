import UploadZone from "../components/upload/UploadZone";

const s = {
  page: { padding: "32px 28px", maxWidth: 900, margin: "0 auto" },
  header: { marginBottom: 32 },
  title: {
    fontFamily: "var(--font-head)",
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#e8edf5",
    marginBottom: 6,
  },
  sub: { color: "#4a5568", fontSize: "0.9rem" },
  steps: { display: "flex", gap: 12, margin: "24px 0 32px", flexWrap: "wrap" },
  step: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: "0.8rem",
    color: "#4a5568",
  },
  num: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "rgba(59,130,246,0.15)",
    border: "1px solid rgba(59,130,246,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#3b82f6",
    flexShrink: 0,
  },
  arrow: { color: "#1e2535", fontSize: "0.7rem" },
};

const STEPS = ["Upload file", "OCR extraction", "AI parsing", "Saved to DB"];

export default function UploadPage() {
  return (
    <div style={s.page} className="fade-in">
      <div style={s.header}>
        <h2 style={s.title}>Upload Invoice</h2>
        <p style={s.sub}>
          Upload a JPG, PNG or PDF invoice and our AI will extract all
          structured data automatically.
        </p>
        <div style={s.steps}>
          {STEPS.map((step, i) => (
            <div
              key={step}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div style={s.step}>
                <span style={s.num}>{i + 1}</span>
                {step}
              </div>
              {i < STEPS.length - 1 && <span style={s.arrow}>→</span>}
            </div>
          ))}
        </div>
      </div>
      <UploadZone />
    </div>
  );
}
