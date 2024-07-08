// api/categoriesPastel/categories.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        select: {
          name: true,
          products: {
            select: {
              id: true,
            },
          },
        },
      });

      const categoryCounts = categories.map((category) => ({
        name: category.name,
        count: category.products.length,
      }));

      res.status(200).json(categoryCounts);
    } catch (error) {
      console.error('Error fetching category counts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
