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

function SidebarContent({ onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo header */}
      <div
        className="flex items-center justify-between px-5 py-5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#8b5cf6)",
              boxShadow: "0 0 16px rgba(59,130,246,0.35)",
            }}
          >
            <Zap size={16} color="#fff" />
          </div>
          <span
            className="text-base font-extrabold"
            style={{ fontFamily: "var(--font-head)", color: "var(--text)" }}
          >
            Invoice AI
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border transition-colors text-[--text2] border-[--border] hover:border-[--accent]"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm border transition-all duration-150 no-underline
               ${
                 isActive
                   ? "font-semibold border-[rgba(59,130,246,0.2)] text-[--accent]"
                   : "font-normal border-transparent text-[--text2] hover:text-[--text] hover:bg-white/5"
               }`
            }
            style={({ isActive }) =>
              isActive ? { background: "rgba(59,130,246,0.1)" } : {}
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer badge */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="rounded-[10px] px-3.5 py-3 border"
          style={{
            background: "rgba(59,130,246,0.08)",
            borderColor: "rgba(59,130,246,0.2)",
          }}
        >
          <div
            className="flex items-center gap-1.5 text-[13px] font-semibold mb-1"
            style={{ color: "var(--accent2)" }}
          >
            <BarChart3 size={13} /> AI Powered
          </div>
          <p
            className="text-[12px] leading-relaxed"
            style={{ color: "var(--text3)" }}
          >
            GPT-4o-mini + Tesseract OCR engine
          </p>
        </div>
      </div>
    </div>
  );
}

/* Mobile sidebar — overlay */
export function MobileSidebar({ open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        className="fixed top-0 left-0 z-40 h-screen w-60 flex flex-col border-r transition-transform duration-[250ms]"
        style={{
          background: "var(--bg2)",
          borderColor: "var(--border)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}

/* Desktop sidebar */
export default function Sidebar() {
  return (
    <aside
      className="sticky top-0 h-screen w-60 flex-shrink-0 flex flex-col border-r"
      style={{ background: "var(--bg2)", borderColor: "var(--border)" }}
    >
      <SidebarContent />
    </aside>
  );
}
