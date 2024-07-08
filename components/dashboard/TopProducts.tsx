import React, { useEffect, useState } from 'react';
import { FaAngleDoubleUp, FaExclamationCircle } from 'react-icons/fa';

interface Product {
  id: number;
  name: string;
  count: number;
}

const TopProducts: React.FC = () => {
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const response = await fetch('/api/rankingProducts/topProducts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTopProducts(data);
      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    }
    fetchTopProducts();
  }, []);

  return (
    <div className='w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll'>
      <h2 className='text-xl font-semibold mb-4'>Top 10 Productos Más Vendidos</h2>
      {topProducts.length === 0 ? (
        <div className='flex items-center justify-center h-full'>
          <FaExclamationCircle className='text-red-500 mr-2' />
          <p className='text-gray-600'>Todavía no se puede procesar ningún ranking de productos por lo que no se han generado ventas.</p>
        </div>
      ) : (
        <ul>
          {topProducts.map((product) => (
            <li key={product.id} className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer'>
              <div className='bg-purple-100 rounded-lg p-3'>
                <FaAngleDoubleUp className='text-green-500' />
              </div>
              <div className='pl-4 flex-grow'>
                <p className='text-gray-800 font-bold'>{product.name}</p>
                <p className='text-gray-400 text-sm'>{product.count}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopProducts;
