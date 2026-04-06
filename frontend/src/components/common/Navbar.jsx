import { useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/upload": "Upload Invoice",
  "/invoices": "Invoices",
  "/analytics": "Analytics",
};

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || "Invoice AI";

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-5 h-16 border-b"
      style={{
        background: "rgba(10,12,16,0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--border)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          className="hamburger-btn items-center justify-center p-2 rounded-lg border transition-all duration-150
                     text-[--text2] border-[--border] hover:text-[--accent] hover:border-[--accent]"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>
        <h1
          className="font-head text-lg font-bold"
          style={{ color: "var(--text)", fontFamily: "var(--font-head)" }}
        >
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        <button
          className="relative flex items-center p-2 rounded-lg border transition-colors
                     text-[--text2] border-[--border] hover:border-[--accent]"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span
            className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full border"
            style={{ background: "var(--red)", borderColor: "var(--bg)" }}
          />
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          title="User"
        >
          AI
        </div>
      </div>
    </header>
  );
}
