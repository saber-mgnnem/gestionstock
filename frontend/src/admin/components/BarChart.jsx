import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ salesData = [], ordersData = [] }) => {
  // Defensive defaults to empty arrays
  const periods = salesData.length ? salesData.map((item) => item.period) : [];
  const salesValues = salesData.length ? salesData.map((item) => item.value) : [];
  
  // Create a map for orders by period for easy lookup
  const ordersMap = new Map(ordersData.map((item) => [item.period, item.value]));
  
  // For each period in salesData, get matching order count or 0 if none
  const ordersValues = periods.map((period) => ordersMap.get(period) || 0);

  const chartData = {
    labels: periods,
    datasets: [
      {
        label: "Sales ($)",
        data: salesValues,
        backgroundColor: "#007bff",
      },
      {
        label: "Orders",
        data: ordersValues,
        backgroundColor: "#28a745",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: "Time (Period)" },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Value" },
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div style={{ height: "400px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
