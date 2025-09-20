// src/utils/formatters.ts
import { format, formatDistanceToNow, parseISO } from "date-fns";

/**
 * Format currency values
 */
export const formatCurrency = (
  amount: string | number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) return "$0.00";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Format numbers with abbreviations (K, M, B)
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

/**
 * Format percentage with proper sign
 */
export const formatPercentage = (
  current: number,
  previous: number,
  decimals: number = 1
): { value: string; type: "increase" | "decrease" | "neutral" } => {
  if (previous === 0) {
    return { value: "0%", type: "neutral" };
  }

  const change = ((current - previous) / previous) * 100;
  // const absChange = Math.abs(change); // absChange not used
  const type = change > 0 ? "increase" : change < 0 ? "decrease" : "neutral";

  return {
    value: `${change > 0 ? "+" : ""}${change.toFixed(decimals)}%`,
    type,
  };
};

/**
 * Format dates consistently
 */
export const formatDate = (
  date: string | Date,
  formatStr: string = "MMM dd, yyyy"
): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return "Invalid date";
  }
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return "Unknown time";
  }
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
