import { useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/upload": "Upload Invoice",
  "/invoices": "Invoices",
  "/analytics": "Analytics",
};

const s = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "rgba(10,12,16,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #1e2535",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: 64,
  },
  left: { display: "flex", alignItems: "center", gap: 16 },
  menuBtn: {
    display: "none",
    padding: 8,
    borderRadius: 8,
    color: "#8b97b0",
    background: "transparent",
    cursor: "pointer",
    "@media(maxWidth:768px)": { display: "flex" },
  },
  title: {
    fontFamily: "var(--font-head)",
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "#e8edf5",
  },
  right: { display: "flex", alignItems: "center", gap: 12 },
  bell: {
    position: "relative",
    padding: 8,
    borderRadius: 8,
    color: "#8b97b0",
    background: "transparent",
    border: "1px solid #1e2535",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  dot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    background: "#ef4444",
    borderRadius: "50%",
    border: "1px solid #0a0c10",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    cursor: "pointer",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: 1,
  },
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || "Invoice AI";

  return (
    <header style={s.nav}>
      <div style={s.left}>
        {onMenuClick && (
          <button onClick={onMenuClick} style={s.menuBtn}>
            <Menu size={20} />
          </button>
        )}
        <h1 style={s.title}>{title}</h1>
      </div>
      <div style={s.right}>
        <button style={s.bell}>
          <Bell size={16} />
          <span style={s.dot} />
        </button>
        <div style={s.avatar}>AI</div>
      </div>
    </header>
  );
}
