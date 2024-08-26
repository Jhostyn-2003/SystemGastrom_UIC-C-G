// pages/api/recomendaciones/opiniones.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const comments = await prisma.recommendation.findMany({
                select: {
                    id: true,
                    userName: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                },
            });
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching comments' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
