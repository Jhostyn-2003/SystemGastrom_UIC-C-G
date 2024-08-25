// pages/api/revenue/products.ts

import { prisma } from '@/src/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { categoryId } = req.query;

    if (!categoryId) {
        return res.status(400).json({ error: 'Category ID is required' });
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                categoryId: parseInt(categoryId as string),
            },
            select: {
                id: true,
                name: true,
                categoryId: true,
                price: true, // Agrega este campo para traer el precio
                stock: true, // Agrega este campo para traer el stock
            },
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}