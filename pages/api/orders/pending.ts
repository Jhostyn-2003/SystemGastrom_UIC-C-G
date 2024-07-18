// pages/api/orders/pending.ts
import { NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(res: NextApiResponse) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: false
      },
      select: {
        name: true,
        total: true,
        date: true
      }
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending orders' });
  }
}
