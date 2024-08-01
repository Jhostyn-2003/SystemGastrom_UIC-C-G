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
  dailyRevenue: RevenueEntry[];
  monthlyRevenue: RevenueEntry[];
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

  useEffect(() => {
    async function fetchChartData() {
      try {
        let url = view === 'daily'
            ? `/api/revenue/${view}?startDate=${startDate}&endDate=${endDate}`
            : `/api/revenue/${view}`;

        const response = await fetch(url);
        const data: ChartDataResponse = await response.json();

        if (data[`${view}Revenue`].length === 0) {
          setNoData(true);
          dispatch({ type: 'SET_NO_DATA', noData: true });
          return;
        }

        setNoData(false);

        const labels = data[`${view}Revenue`].map((entry) => {
          const date = new Date(entry.date);
          return view === 'daily'
              ? formatDate(date, 'day')
              : formatDate(date, 'month');
        });

        const values = data[`${view}Revenue`].map((entry) => entry.total);

        dispatch({
          type: 'SET_DATA',
          data: {
            labels,
            datasets: [
              {
                ...chartData.datasets[0],
                data: values,
              },
            ],
          },
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    }

    fetchChartData();
  }, [view, startDate, endDate, chartData.datasets]);

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
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } else if (format === 'month') {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    } else {
      return date.toISOString().split('T')[0];
    }
  };

  return (
      <div className='w-full md:col-span-2 relative h-auto p-4 border rounded-lg bg-white'>
        <h2 className='text-xl font-semibold mb-4'>{view === 'daily' ? 'Ganancias Diarias' : 'Ganancias Mensuales'}</h2>
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
                    className='block w-full p-2 border rounded'
                />
              </label>
              <label className='block mb-2'>
                Fecha de fin:
                <input
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className='block w-full p-2 border rounded'
                />
              </label>
            </div>
        )}
        {noData ? (
            <p className='text-red-500'>No hay datos disponibles para el rango seleccionado.</p>
        ) : (
            <div className={`relative ${view === 'daily' ? 'h-[30vh]' : 'h-[50vh]'}`}>
              <div className='w-full h-full'>
                <Bar data={chartData} options={{ maintainAspectRatio: false, responsive: true }} />
              </div>
            </div>
        )}
      </div>
  );
}