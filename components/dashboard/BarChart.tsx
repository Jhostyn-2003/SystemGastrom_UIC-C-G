import React, { useReducer, useEffect } from 'react';
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

interface ChartDataSet {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

interface RevenueEntry {
  date: string;
  total: number;
}

interface ChartDataResponse {
  dailyRevenue?: RevenueEntry[];
  monthlyRevenue?: RevenueEntry[];
}

type Action =
    | { type: 'SET_DATA'; data: ChartData }
    | { type: 'SET_NO_DATA'; noData: boolean };

const chartDataReducer = (state: ChartData, action: Action): ChartData => {
  switch (action.type) {
    case 'SET_DATA':
      return action.data;
    case 'SET_NO_DATA':
      return { labels: [], datasets: [] };
    default:
      return state;
  }
};

export default function BarChart() {
  const [chartData, dispatch] = useReducer(chartDataReducer, {
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

  const [view, setView] = React.useState<'daily' | 'monthly'>('monthly');
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');
  const [noData, setNoData] = React.useState<boolean>(false);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  useEffect(() => {
    async function fetchChartData() {
      try {
        const url = view === 'daily'
            ? `/api/revenue/${view}?startDate=${startDate}&endDate=${endDate}`
            : `/api/revenue/${view}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ChartDataResponse = await response.json();

        const revenue = data[`${view}Revenue`];

        if (!revenue || revenue.length === 0) {
          setNoData(true);
          dispatch({ type: 'SET_NO_DATA', noData: true });
          return;
        }

        setNoData(false);

        let labels: string[] = [];
        let values: number[] = [];

        if (view === 'monthly' && revenue.length > 24) {
          // Agrupar por año si hay más de 24 meses de datos
          const yearlyRevenue: { [key: string]: number } = {};
          revenue.forEach((entry) => {
            const year = new Date(entry.date).getUTCFullYear();
            if (!yearlyRevenue[year]) {
              yearlyRevenue[year] = 0;
            }
            yearlyRevenue[year] += entry.total;
          });

          labels = Object.keys(yearlyRevenue).map((year) => year.toString());
          values = Object.values(yearlyRevenue);
        } else {
          // Mantener la vista mensual normal
          labels = revenue.map((entry) => {
            const date = new Date(entry.date);
            return view === 'monthly' ? `${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}` : formatDate(date, view);
          });
          values = revenue.map((entry) => entry.total);
        }

        dispatch({
          type: 'SET_DATA',
          data: {
            labels,
            datasets: [
              {
                label: 'Ganancia $',
                data: values,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.4)',
              },
            ],
          },
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setNoData(true);
      }
    }

    fetchChartData();
  }, [view, startDate, endDate]);

  const toggleView = () => {
    if (view === 'daily') {
      setStartDate('');
      setEndDate('');
    } else {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      setStartDate(formatDate(start, 'input'));
      setEndDate(formatDate(end, 'input'));
    }
    setView(view === 'daily' ? 'monthly' : 'daily');
  };

  const formatDate = (date: Date, format: 'day' | 'month' | 'input'): string => {
    if (format === 'day') {
      return date.toISOString().split('T')[0];
    } else if (format === 'month') {
      return date.toISOString().slice(0, 7);
    } else {
      return date.toISOString().split('T')[0];
    }
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
      <div className='w-full md:col-span-2 p-4 border rounded-lg bg-white shadow-md flex flex-col h-120'>
        <h2 className='text-xl font-semibold mb-4'>
          {view === 'daily' ? 'Ganancias Diarias' : 'Ganancias Mensuales'}
        </h2>
        <button onClick={toggleView} className='mb-4 p-2 bg-blue-600 font-bold text-white rounded'>
          {view === 'daily' ? 'Ver por Mes' : 'Ver por Día'}
        </button>
        {view === 'daily' && (
            <div className='mb-4'>
              <label className='block mb-2'>
                Fecha de inicio:
                <input
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className='border rounded p-2 ml-2'
                />
              </label>
              <label className='block'>
                Fecha de fin:
                <input
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='border rounded p-2 ml-2'
                />
              </label>
            </div>
        )}
        {noData ? (
            <p className='text-red-500'>No hay datos disponibles para mostrar.</p>
        ) : (
            <div className='flex-1'>
              <Bar data={chartData} options={options} />
            </div>
        )}
      </div>
  );
}
