export default function EmptyState({
  icon = "📭",
  title = "Nothing here yet",
  subtitle = "",
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-base font-semibold" style={{ color: "var(--text2)" }}>
        {title}
      </p>
      {subtitle && (
        <p className="text-sm max-w-xs" style={{ color: "var(--text3)" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
