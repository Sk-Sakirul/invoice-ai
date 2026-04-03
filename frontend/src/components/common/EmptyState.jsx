const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "64px 24px",
    color: "#4a5568",
  },
  icon: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: "1rem", fontWeight: 600, color: "#8b97b0" },
  sub: {
    fontSize: "0.875rem",
    color: "#4a5568",
    textAlign: "center",
    maxWidth: 320,
  },
};

export default function EmptyState({
  icon = "📭",
  title = "Nothing here yet",
  subtitle = "",
}) {
  return (
    <div style={styles.wrap}>
      <div style={styles.icon}>{icon}</div>
      <p style={styles.title}>{title}</p>
      {subtitle && <p style={styles.sub}>{subtitle}</p>}
    </div>
  );
}
