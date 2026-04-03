// Format currency amount
export const formatCurrency = (amount, currency = "USD") => {
  if (amount == null) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
};

// Format date string to readable form
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// Format month key "2024-01" → "Jan 2024"
export const formatMonth = (monthStr) => {
  if (!monthStr) return "";
  try {
    const [year, month] = monthStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return monthStr;
  }
};

// Confidence score → label + color
export const confidenceLabel = (score) => {
  if (score == null) return "Unknown";
  if (score >= 0.8) return "High";
  if (score >= 0.5) return "Medium";
  return "Low";
};

// Truncate long strings
export const truncate = (str, len = 30) =>
  str && str.length > len ? str.slice(0, len) + "…" : str || "—";

// File size formatter
export const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const confidenceColor = (score) => {
  if (score >= 0.8) return "#22c55e";
  if (score >= 0.5) return "#f59e0b";
  return "#ef4444";
};