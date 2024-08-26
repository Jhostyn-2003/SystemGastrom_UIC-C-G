// pages/api/recomendaciones/calificacion.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const recommendations = await prisma.recommendation.findMany();

            // Verificar si se obtuvo algo, si no, devolver un array vacío explícitamente
            if (!recommendations || recommendations.length === 0) {
                res.status(200).json([]);  // Responder con un array vacío
            } else {
                res.status(200).json(recommendations);
            }
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            res.status(500).json({ error: 'Error fetching recommendations' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
