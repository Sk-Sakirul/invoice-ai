import { Link } from "react-router-dom";

const s = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "70vh",
    gap: 16,
    textAlign: "center",
    padding: 24,
  },
  code: {
    fontFamily: "var(--font-head)",
    fontSize: "5rem",
    fontWeight: 800,
    color: "#1e2535",
    lineHeight: 1,
  },
  title: {
    fontFamily: "var(--font-head)",
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#e8edf5",
  },
  sub: { color: "#4a5568", fontSize: "0.9rem", maxWidth: 320 },
  btn: {
    marginTop: 8,
    padding: "10px 24px",
    borderRadius: 10,
    background: "#3b82f6",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.875rem",
    textDecoration: "none",
  },
};

export default function NotFound() {
  return (
    <div style={s.wrap}>
      <div style={s.code}>404</div>
      <div style={s.title}>Page not found</div>
      <div style={s.sub}>
        The page you're looking for doesn't exist or has been moved.
      </div>
      <Link to="/" style={s.btn}>
        Go to Dashboard
      </Link>
    </div>
  );
}
