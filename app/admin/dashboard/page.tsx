'use client';

import React, { useEffect, useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import BarChart from '@/components/dashboard/BarChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import PieChart from '@/components/dashboard/PieChart';
import TopProducts from '@/components/dashboard/TopProducts';

// Recomendaciones
import StarRatingsCard from '@/components/dashboard/StarRatingsCard';
import UserCommentsCard from '@/components/dashboard/UserCommentsCard';

interface Stats {
  totalProducts: number;
  totalCategories: number;
  pendingOrders: number;
  readyOrders: number;
}

interface Recommendation {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(true);

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

    async function fetchRecommendations() {
      try {
        const response = await fetch('/api/recomendaciones/calificacion');
        const data = await response.json();
        setRecommendations(data || []);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    }

    fetchStats();
    fetchRecommendations();
  }, []);

  return (
      <div className='bg-gray-100 min-h-screen'>
        <div>
          <div className='p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {stats ? (
                <>
                  <StatCard title="Total Productos" value={stats.totalProducts}/>
                  <StatCard title="Total Categorias" value={stats.totalCategories}/>
                  <StatCard title="Ordenes Pendiente" value={stats.pendingOrders}/>
                  <StatCard title="Ordenes Listas" value={stats.readyOrders}/>
                </>
            ) : (
                <div>Cargando estadísticas...</div>
            )}
          </div>
          <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex justify-center items-center w-full h-full'>
              <PieChart/>
            </div>
            <div className='flex justify-center items-center w-full h-full'>
              <RecentOrders/>
            </div>
            <div className='flex justify-center items-center w-full h-full'>
              <TopProducts/>
            </div>
          </div>
          <div className='p-4 w-full'>
            <BarChart/>
          </div>
        </div>

        <div className='p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className="bg-white p-4 rounded-lg shadow-md w-full">
            {loadingRecommendations ? (
                <p className="text-center text-gray-500">Cargando recomendaciones...</p>
            ) : (
                <StarRatingsCard recommendations={recommendations}/>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md w-full">
            {loadingRecommendations ? (
                <p className="text-center text-gray-500">Cargando opiniones...</p>
            ) : (
                <UserCommentsCard
                    recommendations={recommendations}
                    setRecommendations={setRecommendations}
                />
            )}
          </div>
        </div>
      </div>
  );
}
