// pages/api/orders/pending.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verifica si el método es GET
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Obtén las órdenes pendientes y ordénalas por fecha
    const orders = await prisma.order.findMany({
      where: {
        status: false
      },
      select: {
        name: true,
        total: true,
        date: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Envia la respuesta con el código de estado 200
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ error: 'Error fetching pending orders' });
  }
}