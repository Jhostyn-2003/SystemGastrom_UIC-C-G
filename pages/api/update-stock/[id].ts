// pages/api/update-stock/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const productId = req.query.id as string;
    const { quantity } = req.body;

    if (req.method === 'POST') {
        try {
            const product = await prisma.product.findUnique({
                where: { id: Number(productId) }
            });

            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const newStock = product.stock + quantity;

            if (newStock < 0) {
                return res.status(400).json({ error: 'Stock insuficiente' });
            }

            await prisma.product.update({
                where: { id: Number(productId) },
                data: {
                    stock: newStock
                },
            });

            res.json({ success: true });
        } catch (error) {
            console.error('Error updating stock:', error);
            res.status(500).json({ error: 'Error al actualizar el stock del producto' });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
