// app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import BarChart from '@/components/dashboard/BarChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import PieChart from '@/components/dashboard/PieChart';
import TopProducts from '@/components/dashboard/TopProducts';

interface Stats {
  totalProducts: number;
  totalCategories: number;
  pendingOrders: number;
  readyOrders: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    pendingOrders: 0,
    readyOrders: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  return (
    /*<div className='grid lg:grid-cols-4 gap-4 p-4'>
      <StatCard title="Total Productos" value={stats.totalProducts} />
      <StatCard title="Total Categorias" value={stats.totalCategories} />
      <StatCard title="Ordenes Pendiente" value={stats.pendingOrders} />
      <StatCard title="Ordenes Listas" value={stats.readyOrders} />
    </div>*/
    <div className='bg-gray-100 min-h-screen'>
      <div className='p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard title="Total Productos" value={stats.totalProducts} />
        <StatCard title="Total Categorias" value={stats.totalCategories} />
        <StatCard title="Ordenes Pendiente" value={stats.pendingOrders} />
        <StatCard title="Ordenes Listas" value={stats.readyOrders} />
      </div>
      <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
        <BarChart />
        <RecentOrders />
      </div>

      <div className='p-4 grid md:grid-cols-3 grid-cols-1 gap-4'>
        <PieChart />
        <TopProducts />
      </div>
     
    </div>

  );
}
