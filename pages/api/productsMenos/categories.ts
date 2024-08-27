// pages/api/productsMenos/categories.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
            },
        });

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error fetching categories' });
    }
}
