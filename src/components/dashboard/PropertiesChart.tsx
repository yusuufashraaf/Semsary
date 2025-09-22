/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardHeader, CardBody } from "@components/ui/Card";
import { LoadingSpinner } from "@components/ui/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PropertiesChartProps {
  data?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  loading?: boolean;
  title?: string;
  height?: number;
}

export const PropertiesChart: React.FC<PropertiesChartProps> = ({
  data,
  loading = false,
  title = "Properties by Status",
  height = 300,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed.x} properties`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
          borderDash: [2],
        },
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
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
            <Bar data={data || defaultData} options={options} />
          </div>
        )}
      </CardBody>
    </Card>
  );
};
