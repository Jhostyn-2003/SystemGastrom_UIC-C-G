'use client';

import React from 'react';

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
    return (
        <div className="bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Opiniones del público</h2>
            {recommendations.map((rec) => (
                <div key={rec.id} className="mb-4">
                    <div className="flex items-center mb-2">
                        <div className="bg-gray-300 rounded-full w-10 h-10 flex justify-center items-center text-lg font-bold text-white">
                            {rec.userName.charAt(0)}
                        </div>
                        <div className="ml-4">
                            <p className="font-bold">{rec.userName}</p>
                            <p className="text-gray-500 text-sm">{new Date(rec.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="ml-14">
                        <div className="flex mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`text-yellow-500 ${i < rec.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <p className="text-gray-800">{rec.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserCommentsCard;
