/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Card, CardHeader, CardBody } from "@components/ui/Card";
import { LoadingSpinner } from "@components/ui/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesChartProps {
  data?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension?: number;
    }[];
  };
  loading?: boolean;
  title?: string;
  height?: number;
}

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  loading = false,
  title = "Revenue Over Time",
  height = 300,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            return `${
              context.dataset.label
            }: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: {
          display: true,
          borderDash: [2],
        },
        ticks: {
          callback: function (value: any) {
            return "$" + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };

  const defaultData = {
    labels: [],
    datasets: [],
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="flex items-center justify-center" style={{ height }}>
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div style={{ height }}>
            <Line data={data || defaultData} options={options} />
          </div>
        )}
      </CardBody>
    </Card>
  );
};
