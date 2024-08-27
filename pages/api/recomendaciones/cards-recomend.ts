// pages/api/recomendaciones/cards-recomend.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { startDate } = req.query;

            const where: any = {};

            if (startDate) {
                // Filtrar solo por la fecha exacta, ignorando horas y minutos
                const start = new Date(startDate as string);
                const end = new Date(startDate as string);
                end.setDate(end.getDate() + 1); // Aumentar un día para cubrir todo el rango de 24 horas

                where.createdAt = {
                    gte: start,
                    lt: end,
                };
            }

            const recommendations = await prisma.recommendation.findMany({
                where,
                select: {
                    id: true,
                    userName: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                },
            });

            res.status(200).json(recommendations);
        } catch (error) {
            console.error('Error fetching recommendations and comments:', error);
            res.status(500).json({ error: 'Error fetching data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

