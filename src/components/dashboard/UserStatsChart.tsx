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
// import { getChartColors } from "@utils/formatters";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserStatsChartProps {
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

export const UserStatsChart: React.FC<UserStatsChartProps> = ({
  data,
  loading = false,
  title = "User Registration by Role",
  height = 300,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed.y} users`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          borderDash: [2],
          // borderDashOffset: 2,
        },
        ticks: {
          stepSize: 1,
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
