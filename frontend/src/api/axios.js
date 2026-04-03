import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 120000, // 2 min — OCR + LLM can be slow
  headers: { "Content-Type": "application/json" },
});

// Response interceptor — normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      err.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

// ── Upload ────────────────────────────────────────────────────────────────────
export const uploadInvoice = (formData, setProgress) => {
  return api.post("/api/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (setProgress) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setProgress(percent);
      }
    },
  });
};

// ── Invoices ──────────────────────────────────────────────────────────────────
export const getInvoices = () => api.get("/api/invoices");

export const getInvoice = (id) => api.get(`/api/invoices/${id}`);

export const updateInvoice = (id, payload) =>
  api.put(`/api/invoices/${id}`, payload);

export const deleteInvoice = (id) => api.delete(`/api/invoices/${id}`);

export const getDuplicates = () => api.get("/api/invoices/duplicates/all");

// ── Analytics ─────────────────────────────────────────────────────────────────
export const getSummary = () => api.get("/api/analytics/summary");
export const getVendorSpend = () => api.get("/api/analytics/vendor-spend");
export const getMonthlyTrends = () => api.get("/api/analytics/monthly-trends");
export const getCurrencyBreakdown = () =>
  api.get("/api/analytics/currency-breakdown");

export default api;
