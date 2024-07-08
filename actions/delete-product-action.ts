"use server"

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from "next/cache"

export async function deleteProduct(productId: number) {
    try {
        // Primero, elimina las filas relacionadas en la tabla OrderProducts
        await prisma.orderProducts.deleteMany({
            where: {
                productId: productId
            }
        });

        // Luego, elimina el producto
        const deletedProduct = await prisma.product.delete({
            where: {
                id: productId
            }
        });

        // Este es para que no se cachee la aplicacion y recargue bien
        revalidatePath('/admin/products')

        return deletedProduct;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Could not delete product');
    }
}
