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
      });

      // Create a map of product ids to counts
      const productCounts = topProducts.reduce((acc, product) => {
        acc[product.productId] = product._count.id;
        return acc;
      }, {});

      // Sort products by count in descending order
      products.sort((a, b) => productCounts[b.id] - productCounts[a.id]);

      const topProductsData = products.map((product) => ({
        id: product.id,
        name: product.name,
        count: productCounts[product.id] || 0,
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