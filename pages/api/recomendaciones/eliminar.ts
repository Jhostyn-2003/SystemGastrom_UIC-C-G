// pages/api/recomendaciones/eliminar.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.query;

        try {
            if (id) {
                // Eliminar un comentario específico
                const deletedComment = await prisma.recommendation.delete({
                    where: { id: Number(id) },
                });
                res.status(200).json({ message: 'Comentario eliminado con éxito', deletedComment });
            } else {
                // Eliminar todos los comentarios
                await prisma.recommendation.deleteMany({});
                res.status(200).json({ message: 'Todos los comentarios han sido eliminados' });
            }
        } catch (error) {
            console.error('Error deleting recommendation(s):', error);
            res.status(500).json({ error: 'Error deleting recommendation(s)' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
