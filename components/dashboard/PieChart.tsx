import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

interface CategoryData {
  name: string;
  count: number;
}

export default function PieChartComponent() {
  const [chartData, setChartData] = useState<CategoryData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/categoriesPastel/categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: CategoryData[] = await response.json();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    //Para mostrar los datos por consola
    fetchData();
   /* fetchData().then(r =>
        console.log('PieChartComponent data fetched:', chartData)
    );*/

  }, [chartData]);

  return (
    /* este funcionaba sin rendirizacion para movil
    <div className="w-full lg:col-span-2 p-4 border rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Productos por Categoría</h2>
      <PieChart
        series={[
          {
            data: chartData.map(({ name, count }) => ({ label: name, value: count })),
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        height={300}
      />
    </div>*/
    <div className="w-full lg:col-span-2 p-4 border rounded-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Total de productos por categoría existentes</h2>
      <div className="lg:flex lg:justify-center">
          {/* Renderización para computadoras y Moviles */}
          <PieChart
            series={[
              {
                data: chartData.map(({ name, count }) => ({ label: name, value: count })),
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              },
            ]}
            height={300}
            margin={{ top: 15, bottom: 88, left: 15, right: 15 }} // Ajustar margen 
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 0,
              },
            }}
            className="lg:block"
          />
      </div>
    </div>
  );
}
