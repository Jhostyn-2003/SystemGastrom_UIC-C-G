// pages/api/dashboard/stats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verifica si el método es GET
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Obtén las estadísticas
    const [totalProducts, totalCategories, pendingOrders, readyOrders] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count({ where: { status: false } }),
      prisma.order.count({ where: { status: true } })
    ]);

    // Envia la respuesta con el código de estado 200
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