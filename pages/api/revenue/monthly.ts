// /pages/api/revenue/monthly.ts
// /api/revenue/monthly/[year]/[categoryId]/[productId]

import { Prisma } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { year, categoryId, productId } = req.query;

    try {
        // Verificar que el parámetro de año esté presente
        if (!year) {
            return res.status(400).json({ error: 'Year parameter is required' });
        }

        // Convertir el año en tipo de dato número
        const yearNum = parseInt(year as string);

        // Validar que el año sea un número válido
        if (isNaN(yearNum)) {
            return res.status(400).json({ error: 'Year must be a valid number' });
        }

        const startYear = new Date(`${year}-01-01`);
        const endYear = new Date(`${year}-12-31`);
        endYear.setHours(23, 59, 59, 999);

        // Realizar la consulta SQL para calcular los ingresos mensuales utilizando solo la tabla "Order"
        const revenueData = await prisma.$queryRaw`
            SELECT
                DATE_TRUNC('month', o."date") AS date,
                SUM(o."total") AS total
            FROM "Order" o
            WHERE o."status" = true
            AND o."date" BETWEEN ${startYear} AND ${endYear}
            GROUP BY DATE_TRUNC('month', o."date")
            ORDER BY date;
        `;

        // Filtrar resultados por categoría y producto después de obtener los ingresos totales
        let filteredRevenueData = revenueData;

        if (categoryId || productId) {
            filteredRevenueData = await prisma.$queryRaw`
                SELECT
                    DATE_TRUNC('month', o."date") AS date,
                    SUM(o."total") AS total
                FROM "Order" o
                JOIN "OrderProducts" op ON o."id" = op."orderId"
                JOIN "Product" p ON p."id" = op."productId"
                WHERE o."status" = true
                AND o."date" BETWEEN ${startYear} AND ${endYear}
                ${categoryId ? Prisma.sql`AND p."categoryId" = ${parseInt(categoryId as string)}` : Prisma.sql``}
                ${productId ? Prisma.sql`AND p."id" = ${parseInt(productId as string)}` : Prisma.sql``}
                GROUP BY DATE_TRUNC('month', o."date")
                ORDER BY date;
            `;
        }

        // Enviar la respuesta con los datos de ingresos mensuales filtrados
        res.status(200).json({ monthlyRevenue: filteredRevenueData });
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
