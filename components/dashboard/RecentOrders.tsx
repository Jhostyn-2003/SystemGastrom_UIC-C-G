// components/RecentOrders.tsx
import React, { useState, useEffect } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import { MdOutlinePendingActions } from 'react-icons/md';
import { formatLocalTime, formatCurrecy } from '@/src/utils';

const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders/pending');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
    fetchOrders();
  }, []);

  return (
      <div className='w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll'>
        <h1 className='text-xl font-semibold mb-4'>Órdenes pendientes</h1>
        {orders.length === 0 ? (
            <div className='flex items-center justify-center h-full'>
              <FaExclamationCircle className='text-red-500 mr-2' />
              <p className='text-gray-600'>No hay pedidos recientes</p>
            </div>
        ) : (
            <ul>
              {orders.map((order, id) => (
                  <li
                      key={id}
                      className='bg-gray-50 hover:bg-gray-100 rounded-lg my-3 p-2 flex items-center cursor-pointer'
                  >
                    <div className='bg-purple-100 rounded-lg p-3'>
                      <MdOutlinePendingActions className='text-purple-800' />
                    </div>
                    <div className='pl-4'>
                      <p className='text-gray-800 font-bold'>{order.name}</p>
                      <p className='text-gray-400 text-sm'>{formatCurrecy(order.total)}</p>
                    </div>
                    <p className='lg:flex md:hidden absolute right-6 text-sm'>{formatLocalTime(order.date)}</p>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
};

export default RecentOrders;