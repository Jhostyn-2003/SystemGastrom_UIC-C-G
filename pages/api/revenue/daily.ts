// /pages/api/revenue/daily.ts
//  /api/revenue/daily?startDate=2021-01-01&endDate=2021-01-31&categoryId=1&productId
import { Prisma } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { startDate, endDate, categoryId, productId } = req.query;

    try {
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required for daily view' });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);

        const categoryCondition = categoryId ? Prisma.sql`AND p."categoryId" = ${parseInt(categoryId as string)}` : Prisma.sql``;
        const productCondition = productId ? Prisma.sql`AND p."id" = ${parseInt(productId as string)}` : Prisma.sql``;

        const revenueData = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('day', o."date") AS date,
        SUM(o."total") AS total
      FROM "Order" o
      JOIN "OrderProducts" op ON o."id" = op."orderId"
      JOIN "Product" p ON p."id" = op."productId"
      WHERE o."status" = true
      AND o."date" BETWEEN ${start} AND ${end}
      ${categoryCondition}
      ${productCondition}
      GROUP BY DATE_TRUNC('day', o."date")
      ORDER BY date;
    `;

        res.status(200).json({ dailyRevenue: revenueData });
    } catch (error) {
        console.error('Error fetching revenue data:', error);

        // Comprobación de tipo para asegurar que 'error' tiene una propiedad 'message'
        if (error instanceof Error) {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: 'Unknown error' });
        }
    }
}
