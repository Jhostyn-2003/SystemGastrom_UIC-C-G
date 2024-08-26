// pages/api/recomendaciones/calificacion.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const recommendations = await prisma.recommendation.findMany();
            res.status(200).json(recommendations);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching recommendations' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
