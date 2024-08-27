// pages/api/productsMenos/LowSalesList.ts

import { prisma } from '@/src/lib/prisma';

export default async function handler(req, res) {
    const { categorySlug } = req.query; // Obtenemos el slug de la categoría desde los query params

    try {
        // Obtener todos los productos en la categoría seleccionada
        const productsInCategory = await prisma.product.findMany({
            where: {
                category: {
                    slug: categorySlug,
                },
            },
            select: {
                id: true,
                name: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // Filtrar los productos que no tienen ninguna venta asociada
        const unsoldProducts = await Promise.all(
            productsInCategory.map(async (product) => {
                const salesCount = await prisma.orderProducts.count({
                    where: {
                        productId: product.id,
                    },
                });

                if (salesCount === 0) {
                    return {
                        category: product.category.name,
                        product: product.name,
                        quantity: 0, // Cero ventas
                    };
                }
                return null;
            })
        );

        // Filtrar los valores nulos (productos que sí tienen ventas)
        const filteredUnsoldProducts = unsoldProducts.filter(item => item !== null);

        res.status(200).json(filteredUnsoldProducts);
    } catch (error) {
        console.error('Error fetching unsold products data:', error);
        res.status(500).json({ error: 'Error fetching unsold products data' });
    }
}
