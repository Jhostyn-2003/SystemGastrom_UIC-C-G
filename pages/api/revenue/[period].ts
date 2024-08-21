import { prisma } from '@/src/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

// Define el tipo de los datos de ingresos
type RevenueData = {
  date: Date;
  total: number;
}[];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { period } = req.query;
  const { startDate, endDate } = req.query;

  try {
    let revenueData: RevenueData = [];

    if (period === 'daily') {
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required for daily view' });
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      // Ajusta endDate para incluir todo el día
      end.setHours(23, 59, 59, 999);

      revenueData = await prisma.$queryRaw<RevenueData>`
        SELECT
          DATE_TRUNC('day', "date") AS date,
          SUM("total") AS total
        FROM "Order"
        WHERE "status" = true AND "date" BETWEEN ${start} AND ${end}
        GROUP BY DATE_TRUNC('day', "date")
        ORDER BY date;
      `;
    } else if (period === 'monthly') {
      revenueData = await prisma.$queryRaw<RevenueData>`
        SELECT
          DATE_TRUNC('month', "date") AS date,
          SUM("total") AS total
        FROM "Order"
        WHERE "status" = true
        GROUP BY DATE_TRUNC('month', "date")
        ORDER BY date;
      `;
    } else {
      return res.status(400).json({ error: 'Invalid period parameter' });
    }

    // Formatear la fecha en el formato YYYY-MM-DD
    const formattedRevenueData = revenueData.map((entry) => ({
      date: entry.date.toISOString().split('T')[0],
      total: entry.total,
    }));

    res.status(200).json({ [`${period}Revenue`]: formattedRevenueData });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
