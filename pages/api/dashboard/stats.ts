// pages/api/dashboard/stats.ts
import { NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(res: NextApiResponse) {
  try {
    const [totalProducts, totalCategories, pendingOrders, readyOrders] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count({ where: { status: false } }),
      prisma.order.count({ where: { status: true } })
    ]);

    res.status(200).json({
      totalProducts,
      totalCategories,
      pendingOrders,
      readyOrders
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
}
