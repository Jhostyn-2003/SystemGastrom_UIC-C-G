'use client';

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import BarChart from '@/components/dashboard/BarChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import CategoriesBarChart from '@/components/dashboard/CategoriesBarChart';
import TopProducts from '@/components/dashboard/TopProducts';
import StarRatingsCard from '@/components/dashboard/StarRatingsCard';
import UserCommentsCard from '@/components/dashboard/UserCommentsCard';
import LowSalesList from "@/components/dashboard/LowSalesList";

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

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

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const dateParam = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
                const response = await fetch(`/api/recomendaciones/cards-recomend?startDate=${dateParam}`);
                const data = await response.json();
                setRecommendations(data || []);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setRecommendations([]);
            } finally {
                setLoadingRecommendations(false);
            }
        }

        fetchRecommendations();
    }, [selectedDate]);

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
                <div className='p-4 grid grid-cols-1 gap-4'>
                    <div>
                        <BarChart/>
                    </div>
                    <div>
                        <CategoriesBarChart/>
                    </div>
                </div>

                <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='flex justify-center items-center w-full h-full'>
                        <LowSalesList/>
                    </div>
                    <div className='flex justify-center items-center w-full h-full'>
                        <RecentOrders/>
                    </div>
                    <div className='flex justify-center items-center w-full h-full'>
                        <TopProducts/>
                    </div>
                </div>
            </div>

            <div className='p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                    {loadingRecommendations ? (
                        <p className="text-center text-gray-500">Cargando recomendaciones...</p>
                    ) : (
                        <StarRatingsCard
                            recommendations={recommendations}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            setRecommendations={setRecommendations}
                        />
                    )}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                    {loadingRecommendations ? (
                        <p className="text-center text-gray-500">Cargando opiniones...</p>
                    ) : (
                        <UserCommentsCard
                            recommendations={recommendations}
                            selectedDate={selectedDate}
                            setRecommendations={setRecommendations}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
