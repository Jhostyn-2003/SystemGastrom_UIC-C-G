import React, { useState, useEffect } from 'react';
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

export default function BarChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Ganancia $',
        data: [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.4)',
      },
    ],
  });

  const [view, setView] = useState('daily'); // State to control the view

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch(`/api/revenue/${view}`);
        const data = await response.json();

        const labels = data[`${view}Revenue`].map((entry: { date: string }) => {
          const date = new Date(entry.date);
          return view === 'daily'
            ? formatDate(date, 'day')
            : formatDate(date, 'month');
        });
        
        const values = data[`${view}Revenue`].map((entry: { total: number }) => entry.total);

        setChartData({
          labels,
          datasets: [
            {
              ...chartData.datasets[0],
              data: values,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    }

    fetchChartData().then(r =>
        console.log('Data fetched successfully:', r)
    );
  }, [chartData.datasets, view]); // Fetch data when view changes

  const toggleView = () => {
    setView(view === 'daily' ? 'monthly' : 'daily');
  };

  const formatDate = (date: Date, format: 'day' | 'month') => {
    if (format === 'day') {
      return `${date.getDate()+1}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } else {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return `${monthNames[date.getMonth()+1]} ${date.getFullYear()}`;
    }
  };

  return (
    <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
        <h2 className='text-xl font-semibold mb-4'>{view === 'daily' ? 'Ganancias Diarias' : 'Ganancias Mensuales'}</h2>
      <button onClick={toggleView} className='mb-4 p-2 bg-blue-600 font-bold text-white rounded'>
        {view === 'daily' ? 'Ver por Mes' : 'Ver por Día'}
      </button>
      <Bar data={chartData} />
    </div>
  );
}
