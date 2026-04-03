import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  Zap,
  X,
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Invoice", icon: Upload },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const s = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 30,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(2px)",
  },
  sidebar: (open) => ({
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 40,
    height: "100vh",
    width: 240,
    background: "#10131a",
    borderRight: "1px solid #1e2535",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.25s ease",
    transform: open ? "translateX(0)" : "translateX(-100%)",
  }),
  sidebarDesktop: {
    position: "sticky",
    top: 0,
    height: "100vh",
    width: 240,
    flexShrink: 0,
    background: "#10131a",
    borderRight: "1px solid #1e2535",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 20px",
    borderBottom: "1px solid #1e2535",
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 16px rgba(59,130,246,0.35)",
  },
  logoText: {
    fontFamily: "var(--font-head)",
    fontWeight: 800,
    fontSize: "1rem",
    color: "#e8edf5",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    color: "#8b97b0",
    background: "transparent",
    cursor: "pointer",
    border: "1px solid #1e2535",
  },
  nav: {
    flex: 1,
    padding: "16px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  link: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: active ? 600 : 400,
    fontSize: "0.9rem",
    color: active ? "#3b82f6" : "#8b97b0",
    background: active ? "rgba(59,130,246,0.1)" : "transparent",
    border: active ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
    transition: "all 0.15s ease",
    textDecoration: "none",
  }),
  footer: { padding: "16px 20px", borderTop: "1px solid #1e2535" },
  badge: {
    background: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.2)",
    borderRadius: 10,
    padding: "12px 14px",
  },
  badgeTitle: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#60a5fa",
    marginBottom: 4,
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  badgeSub: { fontSize: "0.75rem", color: "#4a5568", lineHeight: 1.5 },
};

function SidebarContent({ onClose }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={s.header}>
        <div style={s.logo}>
          <div style={s.logoIcon}>
            <Zap size={16} color="#fff" />
          </div>
          <span style={s.logoText}>Invoice AI</span>
        </div>
        {onClose && (
          <button onClick={onClose} style={s.closeBtn}>
            <X size={15} />
          </button>
        )}
      </div>

      <nav style={s.nav}>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            style={({ isActive }) => s.link(isActive)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={s.footer}>
        <div style={s.badge}>
          <div style={s.badgeTitle}>
            <BarChart3 size={13} /> AI Powered
          </div>
          <div style={s.badgeSub}>Gemini 1.5 Flash + Tesseract OCR engine</div>
        </div>
      </div>
    </div>
  );
}

// Mobile sidebar (overlay)
export function MobileSidebar({ open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div style={s.overlay} onClick={onClose} />
      <aside style={s.sidebar(open)}>
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}

// Desktop sidebar (always visible)
export default function Sidebar() {
  return (
    <aside style={s.sidebarDesktop}>
      <SidebarContent />
    </aside>
  );
}
