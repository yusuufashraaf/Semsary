/**
 * Generate chart colors palette
 */
export const getChartColors = (count: number): string[] => {
  const colors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
    "#ec4899", // pink
    "#6b7280", // gray
  ];

  // Repeat colors if we need more than available
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }

  return result;
};

/**
 * Transform data for chart consumption
 */
export const transformToChartData = (
  data: Record<string, number>,
  labelFormatter?: (key: string) => string
) => {
  const labels = Object.keys(data);
  const values = Object.values(data);

  return {
    labels: labelFormatter ? labels.map(labelFormatter) : labels,
    datasets: [
      {
        data: values,
        backgroundColor: getChartColors(labels.length),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };
};
