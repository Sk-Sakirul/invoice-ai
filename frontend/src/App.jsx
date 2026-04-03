import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar, { MobileSidebar } from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";

const s = {
  app: { display: "flex", minHeight: "100vh", background: "var(--bg)" },
  // Desktop sidebar — hidden on mobile via media query workaround
  desktopSidebar: { display: "flex" },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    overflowX: "hidden",
  },
  content: { flex: 1, overflowY: "auto" },
};

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <BrowserRouter>
      <div style={s.app}>
        {/* Desktop sidebar — visible ≥ 768px */}
        <div className="sidebar-desktop">
          <Sidebar />
        </div>

        {/* Mobile sidebar — overlay */}
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Main area */}
        <div style={s.main}>
          <Navbar onMenuClick={() => setMobileOpen(true)} />
          <div style={s.content}>
            <AppRoutes />
          </div>
        </div>
      </div>

      {/* Inline responsive style — no Tailwind needed */}
      <style>{`
        .sidebar-desktop { display: flex; }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }
        }
      `}</style>
    </BrowserRouter>
  );
}
