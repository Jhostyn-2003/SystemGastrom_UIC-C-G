'use client';

import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';  // Importando el ícono de estrella de FontAwesome

interface Recommendation {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface UserCommentsCardProps {
    recommendations: Recommendation[];
}

const UserCommentsCard: React.FC<UserCommentsCardProps> = ({ recommendations }) => {
    const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');

    const formatDateUTC = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timeZone: 'UTC',
        };
        return date.toLocaleDateString('es-ES', options);
    };

    const filteredRecommendations = selectedRating === 'all'
        ? recommendations
        : recommendations.filter((rec) => rec.rating === selectedRating);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Opiniones del público</h2>
                <div className="relative">
                    <select
                        value={selectedRating}
                        onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        className="border rounded p-2 appearance-none pr-8"
                    >
                        <option value="all">Todas las estrellas</option>
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <option key={rating} value={rating}>
                                {rating} estrellas
                            </option>
                        ))}
                    </select>
                    <span className="absolute right-2 top-2 text-yellow-500 pointer-events-none">
                        <FaStar />
                    </span>
                </div>
            </div>
            {filteredRecommendations.map((rec) => (
                <div key={rec.id} className="mb-4">
                    <div className="flex items-center mb-2">
                        <div className="bg-gray-300 rounded-full w-10 h-10 flex justify-center items-center text-lg font-bold text-white">
                            {rec.userName.charAt(0)}
                        </div>
                        <div className="ml-4">
                            <p className="font-bold">{rec.userName}</p>
                            <p className="text-gray-500 text-sm">{formatDateUTC(rec.createdAt)}</p>
                        </div>
                    </div>
                    <div className="ml-14">
                        <div className="flex mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`${
                                        i < rec.rating ? 'text-yellow-500' : 'text-gray-300'
                                    }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <p className="text-gray-800">{rec.comment}</p>
                    </div>
                </div>
            ))}
            {filteredRecommendations.length === 0 && (
                <p className="text-center text-gray-500">No hay comentarios disponibles para esta selección.</p>
            )}
        </div>
    );
};

export default UserCommentsCard;
