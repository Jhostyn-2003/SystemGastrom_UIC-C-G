// /pages/api/revenue/monthly.ts
// /api/revenue/monthly/[year]/[categoryId]/[productId]

import { Prisma } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { year, categoryId, productId } = req.query;

    try {
        const startYear = new Date(`${year}-01-01`);
        const endYear = new Date(`${year}-12-31`);
        endYear.setHours(23, 59, 59, 999);

        const categoryCondition = categoryId ? Prisma.sql`AND p."categoryId" = ${parseInt(categoryId as string)}` : Prisma.sql``;
        const productCondition = productId ? Prisma.sql`AND p."id" = ${parseInt(productId as string)}` : Prisma.sql``;

        const revenueData = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', o."date") AS date,
        SUM(o."total") AS total
      FROM "Order" o
      JOIN "OrderProducts" op ON o."id" = op."orderId"
      JOIN "Product" p ON p."id" = op."productId"
      WHERE o."status" = true
      AND o."date" BETWEEN ${startYear} AND ${endYear}
      ${categoryCondition}
      ${productCondition}
      GROUP BY DATE_TRUNC('month', o."date")
      ORDER BY date;
    `;

        res.status(200).json({ monthlyRevenue: revenueData });
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
