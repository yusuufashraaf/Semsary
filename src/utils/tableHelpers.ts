/**
 * Sort table data
 */
export const sortTableData = <T>(
  data: T[],
  key: keyof T,
  direction: "asc" | "desc"
): T[] => {
  return [...data].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === "asc" ? -1 : 1;
    if (bValue == null) return direction === "asc" ? 1 : -1;

    // Handle different data types
    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Default string comparison
    const aStr = String(aValue);
    const bStr = String(bValue);
    return direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
};

/**
 * Filter table data
 */
export const filterTableData = <T>(
  data: T[],
  searchTerm: string,
  searchKeys: (keyof T)[]
): T[] => {
  if (!searchTerm.trim()) return data;

  const lowercaseSearch = searchTerm.toLowerCase();

  return data.filter((item) =>
    searchKeys.some((key) => {
      const value = item[key];
      if (value == null) return false;
      return String(value).toLowerCase().includes(lowercaseSearch);
    })
  );
};
