import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RevenueDataParams {
    view: 'daily' | 'monthly';
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    productId?: string;
}

export async function getRevenueData(params: RevenueDataParams) {
    const { view, startDate, endDate, categoryId, productId } = params;

    const whereClause: any = {};

    if (startDate) {
        whereClause.date = { gte: new Date(startDate) };
    }

    if (endDate) {
        whereClause.date = { lte: new Date(endDate) };
    }

    if (categoryId) {
        whereClause.categoryId = parseInt(categoryId, 10);
    }

    if (productId) {
        whereClause.productId = parseInt(productId, 10);
    }

    const revenueData = await prisma.revenue.findMany({
        where: whereClause,
        select: {
            date: true,
            total: true,
        },
        orderBy: {
            date: 'asc',
        },
    });

    return {
        [`${view}Revenue`]: revenueData,
    };
}
