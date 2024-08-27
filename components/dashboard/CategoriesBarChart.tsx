// app/admin/dashboard/CategoriesBarChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels // Registrar el plugin de etiquetas
);

export default function CategoriesBarChart() {
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const response = await fetch('/api/categoriesPastel/categories');
        const data = await response.json();

        if (Array.isArray(data)) {
          setCategoryData(data);
        } else {
          setCategoryData([]); // Si la respuesta no es un array, establece un array vacío
        }
      } catch (error) {
        setCategoryData([]); // En caso de error, establece un array vacío
      }
    }

    fetchCategoryData();
  }, []);

  const chartData = {
    labels: categoryData.map((category) => category.name),
    datasets: [
      {
        label: 'Cantidad de Productos',
        data: categoryData.map((category) => category.count),
        backgroundColor: '#51829B',
        borderColor: '#51829B',
        borderWidth: 1,
        datalabels: {
          anchor: 'end',
          align: 'end',
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
          formatter: function (value) {
            return value; // Mostrar el valor total
          }
        },
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const, // Esto hace que la gráfica sea horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
            weight: 'bold' as const,
          },
          color: '#51829B',
        },
      },
      title: {
        display: true,
        text: 'Productos por Categoría',
        font: {
          size: 18,
          family: 'Arial, sans-serif',
          weight: 'bold' as const,
        },
        color: '#333',
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value) => `${value}`, // Formatear para mostrar el número total
        color: '#333',
        font: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
      <div className="w-full h-96 p-4 bg-white rounded-lg shadow-md">
        <Bar data={chartData} options={chartOptions} />
      </div>
  );
}
