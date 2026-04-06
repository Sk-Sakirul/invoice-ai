export default function Loader({ text = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6">
      <div
        className="w-9 h-9 rounded-full border-[3px] spinner"
        style={{
          borderColor: "var(--border2)",
          borderTopColor: "var(--accent)",
        }}
      />
      <span className="text-sm" style={{ color: "var(--text2)" }}>
        {text}
      </span>
    </div>
  );
}
