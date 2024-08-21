import React, { useReducer, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { z } from 'zod';
import { toast } from 'react-toastify';
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

const dateSchema = z.object({
  startDate: z.string().min(1, "Fecha de inicio es requerida"),
  endDate: z.string().min(1, "Fecha de fin es requerida")
});

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

        if (view === 'monthly') {
          // Agrupar por mes y año en formato UTC
          const monthlyRevenue: { [key: string]: number } = {};
          revenue.forEach((entry) => {
            const date = new Date(entry.date);
            const key = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`; // YYYY-MM
            if (!monthlyRevenue[key]) {
              monthlyRevenue[key] = 0;
            }
            monthlyRevenue[key] += entry.total;
          });

          labels = Object.keys(monthlyRevenue).map((key) => {
            const [year, month] = key.split('-').map(Number);
            return `${monthNames[month - 1]} ${year}`;
          });

          values = Object.values(monthlyRevenue);
        } else {
          // Vista diaria
          labels = revenue.map((entry) => formatDate(new Date(entry.date), 'day'));
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
      const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
      const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));

      setStartDate(formatDate(start, 'input'));
      setEndDate(formatDate(end, 'input'));
    }
    setView(view === 'daily' ? 'monthly' : 'daily');
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedEndDate = e.target.value;

    // Validar las fechas
    const validationResult = dateSchema.safeParse({
      startDate,
      endDate: selectedEndDate
    });

    if (validationResult.success) {
      if (selectedEndDate < startDate) {
        toast.error("La fecha de fin no puede ser menor que la fecha de inicio.");
        return;
      }
      setEndDate(selectedEndDate);
    } else {
      toast.error(validationResult.error.issues.map(issue => issue.message).join(', '));
    }
  };

  const formatDate = (date: Date, format: 'day' | 'month' | 'input'): string => {
    // La fecha ya está en UTC, solo formatear
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
                    className='block w-full p-2 border border-gray-300 rounded'
                />
              </label>
              <label className='block mb-2'>
                Fecha de fin:
                <input
                    type='date'
                    value={endDate}
                    onChange={handleEndDateChange}
                    className='block w-full p-2 border border-gray-300 rounded'
                />
              </label>
            </div>
        )}
        <div className='flex-1'>
          <Bar data={chartData} options={options} />
        </div>
        {noData && <p className='text-red-500 mt-4'>No hay datos disponibles para mostrar.</p>}
      </div>
  );
}
