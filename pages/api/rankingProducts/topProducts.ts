// api/topProducts.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const topProducts = await prisma.orderProducts.groupBy({
        by: ['productId'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      });

      const productIds = topProducts.map((product) => product.productId);
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      const topProductsData = products.map((product) => ({
        id: product.id,
        name: product.name,
        count: topProducts.find((p) => p.productId === product.id)?._count?.id || 0,
      }));

      res.status(200).json(topProductsData);
    } catch (error) {
      console.error('Error fetching top products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}