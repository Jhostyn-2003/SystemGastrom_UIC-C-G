'use client'

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
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import Select from 'react-select';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

registerLocale('es', es);  // Registra el idioma español

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface RevenueData {
  date: string;
  total: number;
}

export default function Dashboard() {
  const [view, setView] = useState<'daily' | 'monthly'>('monthly');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedYear, setSelectedYear] = useState<Date | null>(new Date());
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory.id);
    } else {
      setProducts([]);
      setSelectedProduct(null);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchRevenueData();
  }, [view, startDate, endDate, selectedYear, selectedCategory, selectedProduct]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/revenue/categories');
      if (!response.ok) throw new Error('Error al obtener las categorías');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchProducts = async (categoryId: number) => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(`/api/revenue/products?categoryId=${categoryId}`);
      if (!response.ok) throw new Error('Error al obtener los productos');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      let url = `/api/revenue/${view}?`;
      const params = new URLSearchParams();

      if (view === 'daily') {
        if (startDate) params.append('startDate', startDate.toISOString().split('T')[0]);
        if (endDate) {
          const endDateWithTime = new Date(endDate);
          endDateWithTime.setHours(23, 59, 59, 999);
          params.append('endDate', endDateWithTime.toISOString().split('T')[0]);
        }
      } else {
        if (selectedYear) params.append('year', selectedYear.getUTCFullYear().toString());
      }

      if (selectedCategory) params.append('categoryId', selectedCategory.id.toString());
      if (selectedProduct) params.append('productId', selectedProduct.id.toString());

      url += params.toString();

      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener los datos de ingresos');
      const data = await response.json();
      const revenueKey = view === 'daily' ? 'dailyRevenue' : 'monthlyRevenue';
      const formattedRevenueData = view === 'monthly'
          ? formatMonthlyRevenueData(data[revenueKey])
          : formatDailyRevenueData(data[revenueKey]);
      setRevenueData(formattedRevenueData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatMonthlyRevenueData = (data: RevenueData[]) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const monthTotals = Array(12).fill(0);

    data.forEach(item => {
      const date = new Date(item.date);
      const monthIndex = date.getUTCMonth();
      monthTotals[monthIndex] += item.total;
    });

    return months.map((month, index) => ({
      date: month,
      total: monthTotals[index],
    }));
  };

  const formatDailyRevenueData = (data: RevenueData[]) => {
    return data.map(item => ({
      date: new Date(item.date).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      total: item.total,
    }));
  };

  const handleViewChange = (selectedView: 'daily' | 'monthly') => {
    setView(selectedView);
    if (selectedView === 'daily') {
      const now = new Date();
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
      const lastDayOfWeek = new Date(now.setDate(firstDayOfWeek.getDate() + 6));
      setStartDate(firstDayOfWeek);
      setEndDate(lastDayOfWeek);
      setSelectedCategory(null);
      setSelectedProduct(null);
    }
  };

  const chartData = {
    labels: revenueData.map(d => d.date),
    datasets: [
      {
        label: 'Ingresos',
        data: revenueData.map(d => d.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
            weight: 'bold',
          },
          color: '#4a4a4a',
        },
      },
      title: {
        display: true,
        text: 'Gráfico de Ingresos',
        font: {
          size: 18,
          family: 'Arial, sans-serif',
          weight: 'bold',
        },
        color: '#333',
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          maxRotation: window.innerWidth < 640 ? 90 : 0,
          minRotation: window.innerWidth < 640 ? 90 : 0,
          autoSkip: window.innerWidth >= 640,
          maxTicksLimit: 12,
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
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Ingresos: Vista Mensual y Diaria</h1>

        <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
          <select
              value={view}
              onChange={(e) => handleViewChange(e.target.value as 'daily' | 'monthly')}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          >
            <option value="daily">Diario</option>
            <option value="monthly">Mensual</option>
          </select>

          {view === 'daily' ? (
              <>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd" // Cambiado para que coincida con el formato de la API
                    locale="es"
                    placeholderText="Fecha de inicio"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 w-full"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="yyyy-MM-dd" // Cambiado para que coincida con el formato de la API
                    locale="es"
                    placeholderText="Fecha de fin"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 w-full"
                />
              </>
          ) : (
              <DatePicker
                  selected={selectedYear}
                  onChange={(date) => setSelectedYear(date)}
                  showYearPicker
                  dateFormat="yyyy"
                  placeholderText="Seleccionar año"
                  maxDate={new Date(currentYear, 11, 31)}
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 w-full"
              />
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center mb-6 gap-4">
          <Select
              value={selectedCategory ? { value: selectedCategory.id, label: selectedCategory.name } : null}
              onChange={(option) => {
                const category = categories.find(c => c.id === option?.value);
                setSelectedCategory(category || null);
              }}
              options={categories.map(category => ({ value: category.id, label: category.name }))}
              placeholder="Todas las categorías"
              className="w-full md:w-1/2"
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  padding: '4px',
                  borderColor: '#d1d5db',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#a7a7a7',
                  },
                }),
              }}
          />

          {selectedCategory && (
              <div className="w-full md:w-1/2 relative">
                <Select
                    value={selectedProduct ? { value: selectedProduct.id, label: selectedProduct.name } : null}
                    onChange={(option) => {
                      const product = products.find(p => p.id === option?.value);
                      setSelectedProduct(product || null);
                    }}
                    options={products.map(product => ({ value: product.id, label: product.name }))}
                    placeholder={isLoadingProducts ? "Cargando productos..." : "Todos los productos"}
                    className="w-full"
                    isClearable
                    isDisabled={isLoadingProducts}
                    styles={{
                      control: (base) => ({
                        ...base,
                        padding: '4px',
                        borderColor: '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#a7a7a7',
                        },
                      }),
                    }}
                />
                {isLoadingProducts && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    </div>
                )}
              </div>
          )}
        </div>

        <div className="chart-container mb-6" style={{ minHeight: '300px', height: '50vh' }}>
          <Bar data={chartData} options={chartOptions} className="w-full h-full" />
        </div>
      </div>
  );
}
