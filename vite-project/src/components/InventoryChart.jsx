// components/InventoryChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const InventoryChart = () => {
  const data = {
    labels: ['Electronics', 'Clothing', 'Food', 'Books', 'Furniture', 'Sports'],
    datasets: [
      {
        label: 'Products in Stock',
        data: [65, 59, 80, 45, 56, 32],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
      {
        label: 'Products Sold (Month)',
        data: [45, 49, 60, 35, 36, 22],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory by Category'
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default InventoryChart;