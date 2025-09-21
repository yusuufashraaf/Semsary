// src/utils/formatters.ts

/**
 * Format currency values with proper symbols and localization
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  if (isNaN(amount)) return '$0.00';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format numbers with K, M, B abbreviations
 */
export const formatNumber = (
  num: number,
  decimals: number = 1
): string => {
  if (isNaN(num)) return '0';
  
  if (num < 1000) {
    return num.toString();
  }
  
  const units = ['', 'K', 'M', 'B', 'T'];
  const unitIndex = Math.floor(Math.log10(Math.abs(num)) / 3);
  const unitValue = Math.pow(1000, unitIndex);
  const scaledValue = num / unitValue;
  
  return `${scaledValue.toFixed(decimals)}${units[unitIndex]}`;
};

/**
 * Format dates in a human-readable format
 */
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format date with time
 */
export const formatDateTime = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  
  return formatDate(date, defaultOptions);
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Format percentage values
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  if (isNaN(value)) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format file sizes (bytes to KB, MB, GB, etc.)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const decimals = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format phone numbers
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format US phone numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format international numbers with country code
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if formatting not applicable
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (
  text: string,
  maxLength: number = 100,
  ellipsis: string = '...'
): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength).trim() + ellipsis;
};

/**
 * Format duration in seconds to human readable format
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format status text for display
 */
export const formatStatus = (status: string): string => {
  if (!status) return '';
  
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};