import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Sidebar, { MobileSidebar } from "./components/common/Sidebar";
import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Desktop sidebar */}
        <div className="sidebar-desktop">
          <Sidebar />
        </div>

        {/* Mobile slide-in sidebar */}
        <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden">
          <Navbar onMenuClick={() => setMobileOpen(true)} />
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}
