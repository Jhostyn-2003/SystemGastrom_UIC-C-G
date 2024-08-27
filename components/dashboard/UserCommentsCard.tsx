'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaTrashAlt } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Recommendation {
    id: number;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface UserCommentsCardProps {
    recommendations: Recommendation[];
    setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>;
    selectedDate: Date | null;
}

const UserCommentsCard: React.FC<UserCommentsCardProps> = ({ recommendations, setRecommendations, selectedDate }) => {
    const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
    const isDeletingRef = useRef(false);

    useEffect(() => {
        if (!selectedDate) return;

        const fetchFilteredComments = async () => {
            try {
                const response = await fetch(`/api/recomendaciones/cards-recomend?startDate=${selectedDate.toISOString().split('T')[0]}`);
                const data = await response.json();
                setRecommendations(data || []);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchFilteredComments();
    }, [selectedDate, setRecommendations]);

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

    const handleDelete = (id: number) => {
        if (isDeletingRef.current) return;

        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de eliminar este comentario?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: async () => {
                        isDeletingRef.current = true;
                        try {
                            const response = await fetch(`/api/recomendaciones/eliminar?id=${id}`, {
                                method: 'DELETE',
                            });
                            if (response.ok) {
                                setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
                                toast.success('Comentario eliminado con éxito', {
                                    autoClose: 2000,
                                    hideProgressBar: true,
                                });
                            } else {
                                toast.error('Error al eliminar el comentario');
                            }
                        } catch (error) {
                            console.error('Error deleting comment:', error);
                            toast.error('Error al eliminar el comentario');
                        } finally {
                            isDeletingRef.current = false;
                        }
                    },
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };

    const handleDeleteAll = () => {
        if (isDeletingRef.current) return;

        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de eliminar todos los comentarios?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: async () => {
                        isDeletingRef.current = true;
                        try {
                            const response = await fetch(`/api/recomendaciones/eliminar`, {
                                method: 'DELETE',
                            });
                            if (response.ok) {
                                setRecommendations([]);
                                toast.success('Todos los comentarios han sido eliminados con éxito', {
                                    autoClose: 2000,
                                    hideProgressBar: true,
                                });
                            } else {
                                toast.error('Error al eliminar los comentarios');
                            }
                        } catch (error) {
                            console.error('Error deleting all comments:', error);
                            toast.error('Error al eliminar los comentarios');
                        } finally {
                            isDeletingRef.current = false;
                        }
                    },
                },
                {
                    label: 'No',
                    onClick: () => {}
                }
            ]
        });
    };

    const filteredRecommendations = selectedRating === 'all'
        ? recommendations
        : recommendations.filter((rec) => rec.rating === selectedRating);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
            <ToastContainer />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Opiniones del público</h2>
                <div className="flex items-center space-x-4">
                    {recommendations.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                            <FaTrashAlt />
                        </button>
                    )}
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
            </div>
            {filteredRecommendations.length > 0 ? (
                filteredRecommendations.map((rec) => (
                    <div key={rec.id} className="mb-4">
                        <div className="flex items-center mb-2 justify-between">
                            <div className="flex items-center">
                                <div className="bg-gray-300 rounded-full w-10 h-10 flex justify-center items-center text-lg font-bold text-white">
                                    {rec.userName.charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <p className="font-bold">{rec.userName}</p>
                                    <p className="text-gray-500 text-sm">{formatDateUTC(rec.createdAt)}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(rec.id)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                <FaTrashAlt />
                            </button>
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
                ))
            ) : (
                <p className="text-center text-gray-500">No hay comentarios disponibles para esta selección.</p>
            )}
        </div>
    );
};

export default UserCommentsCard;
