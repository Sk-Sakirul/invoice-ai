import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UploadPage from "../pages/UploadPage";
import InvoicesPage from "../pages/InvoicesPage";
import NotFound from "../pages/NotFound";
import AnalyticsPage from "../pages/AnalyticsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/invoices" element={<InvoicesPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
