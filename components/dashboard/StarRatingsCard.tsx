'use client';

import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Recommendation {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface StarRatingsCardProps {
    recommendations: Recommendation[];
    setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>;
    selectedDate: Date | null;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const StarRatingsCard: React.FC<StarRatingsCardProps> = ({ recommendations, setRecommendations, selectedDate, setSelectedDate }) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    useEffect(() => {
        if (!selectedDate) return;

        const fetchFilteredRecommendations = async () => {
            try {
                const response = await fetch(`/api/recomendaciones/cards-recomend?startDate=${selectedDate.toISOString().split('T')[0]}`);
                const data = await response.json();
                setRecommendations(data || []);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchFilteredRecommendations();
    }, [selectedDate, setRecommendations]);

    const totalRatings = recommendations.length;
    const averageRating = totalRatings > 0 ? (recommendations.reduce((sum, rec) => sum + rec.rating, 0) / totalRatings).toFixed(1) : 0;

    const ratingCount = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: recommendations.filter((rec) => rec.rating === rating).length,
    }));

    const renderStars = () => {
        return Array.from({ length: 5 }).map((_, i) => {
            const starRating = i + 1;
            const fullStarWidth = averageRating >= starRating ? '100%' :
                averageRating > starRating - 1 ? `${(Number(averageRating) - (starRating - 1)) * 100}%` : '0%';

            return (
                <span
                    key={i}
                    className="relative"
                    style={{ fontSize: '2rem', display: 'inline-block', width: '1em', height: '1em' }} // Ajustar tamaño para móvil
                >
                    <span className="absolute text-gray-300">★</span>
                    <span
                        className="absolute text-yellow-500 overflow-hidden"
                        style={{ width: fullStarWidth }}
                    >
                        ★
                    </span>
                </span>
            );
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md min-h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold">Resumen de la calificación del público</h2> {/* Ajuste de tamaño para móvil */}
                <div className="relative">
                    <FaCalendarAlt
                        className="text-gray-500 cursor-pointer"
                        onClick={() => setIsDatePickerOpen(true)}
                    />
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            setIsDatePickerOpen(false);
                        }}
                        dateFormat="yyyy-MM-dd"
                        className="hidden" // Esconder el input
                        isClearable
                        open={isDatePickerOpen}
                        onClickOutside={() => setIsDatePickerOpen(false)}
                        popperPlacement="bottom-end"
                    />
                </div>
            </div>
            <div>
                <div className="flex items-center mb-4">
                    <span className="text-4xl md:text-5xl font-bold">{averageRating}</span> {/* Ajuste de tamaño para móvil */}
                    <div className="ml-4">
                        <div className="flex">
                            {renderStars()}
                        </div>
                        <span className="text-md md:text-lg text-gray-500">{totalRatings} calificaciones</span> {/* Ajuste de tamaño para móvil */}
                    </div>
                </div>
            </div>
            <div className="mt-4">
                {ratingCount.map(({ rating, count }) => (
                    <div key={rating} className="flex items-center mb-2">
                        <span className="text-yellow-500 text-sm md:text-lg">{rating} ★</span> {/* Ajuste de tamaño para móvil */}
                        <div className="flex-grow bg-gray-300 mx-2 h-2 md:h-3 rounded-lg overflow-hidden"> {/* Ajuste de altura para móvil */}
                            <div
                                className="bg-yellow-500 h-full"
                                style={{ width: `${totalRatings > 0 ? (count / totalRatings) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <span className="text-sm md:text-lg text-gray-600">{count}</span> {/* Ajuste de tamaño para móvil */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StarRatingsCard;
