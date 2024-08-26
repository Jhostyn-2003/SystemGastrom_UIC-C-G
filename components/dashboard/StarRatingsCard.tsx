'use client';

import React from 'react';

interface Recommendation {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface StarRatingsCardProps {
    recommendations: Recommendation[];
}

const StarRatingsCard: React.FC<StarRatingsCardProps> = ({ recommendations }) => {
    const totalRatings = recommendations.length;
    const averageRating = recommendations.reduce((sum, rec) => sum + rec.rating, 0) / totalRatings;

    const ratingCount = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: recommendations.filter((rec) => rec.rating === rating).length,
    }));

    const renderStars = () => {
        return Array.from({ length: 5 }).map((_, i) => {
            const starRating = i + 1;
            const fullStarWidth = averageRating >= starRating ? '100%' :
                averageRating > starRating - 1 ? `${(averageRating - (starRating - 1)) * 100}%` : '0%';

            return (
                <span
                    key={i}
                    className="relative"
                    style={{ fontSize: '3rem', display: 'inline-block', width: '1em', height: '1em' }}
                >
                    <span className="absolute text-gray-300">
                        ★
                    </span>
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
            <div>
                <h2 className="text-xl font-bold mb-4">Resumen de la calificación del público</h2>
                <div className="flex items-center mb-4">
                    <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
                    <div className="ml-4">
                        <div className="flex">
                            {renderStars()}
                        </div>
                        <span className="text-lg text-gray-500">{totalRatings} calificaciones</span>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                {ratingCount.map(({ rating, count }) => (
                    <div key={rating} className="flex items-center mb-2">
                        <span className="text-yellow-500 text-lg">{rating} ★</span>
                        <div className="flex-grow bg-gray-300 mx-2 h-3 rounded-lg overflow-hidden">
                            <div
                                className="bg-yellow-500 h-full"
                                style={{ width: `${(count / totalRatings) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-lg text-gray-600">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StarRatingsCard;
