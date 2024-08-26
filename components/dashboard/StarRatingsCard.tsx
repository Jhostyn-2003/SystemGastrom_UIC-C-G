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
        const fullStars = Math.floor(averageRating);
        const hasHalfStar = averageRating - fullStars >= 0.5;

        return Array.from({ length: 5 }).map((_, i) => {
            if (i < fullStars) {
                return (
                    <span key={i} className="text-yellow-500" style={{ fontSize: '2rem' }}>
                        ★
                    </span>
                );
            } else if (i === fullStars && hasHalfStar) {
                return (
                    <span key={i} className="text-yellow-500" style={{ fontSize: '2rem', position: 'relative' }}>
                        <span className="text-yellow-500" style={{ position: 'absolute', width: '50%', overflow: 'hidden' }}>
                            ★
                        </span>
                        <span className="text-gray-300">
                            ★
                        </span>
                    </span>
                );
            } else {
                return (
                    <span key={i} className="text-gray-300" style={{ fontSize: '2rem' }}>
                        ★
                    </span>
                );
            }
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Resumen de la calificación del público</h2>
            <div className="flex items-center mb-4">
                <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
                <div className="ml-4">
                    <div className="flex">
                        {renderStars()}
                    </div>
                    <span className="text-sm text-gray-500">{totalRatings} calificaciones</span>
                </div>
            </div>
            {ratingCount.map(({ rating, count }) => (
                <div key={rating} className="flex items-center mb-2">
                    <span className="text-yellow-500">{rating} ★</span>
                    <div className="flex-grow bg-gray-300 mx-2 h-2 rounded-lg overflow-hidden">
                        <div
                            className="bg-yellow-500 h-full"
                            style={{ width: `${(count / totalRatings) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-gray-600">{count}</span>
                </div>
            ))}
        </div>
    );
};

export default StarRatingsCard;
