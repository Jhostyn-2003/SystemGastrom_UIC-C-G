"use server"

// delete-order-action.ts

import { PrismaClient } from '@prisma/client';
import { OrderIdSchema } from '@/src/schema';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function deleteOrder(formData: FormData) {
    const data = {
        orderId: formData.get('order_id') as string  // Aseguramos que orderId sea tratado como string
    };

    const result = OrderIdSchema.safeParse(data);

    if (!result.success) {
        console.error('Error parsing order ID:', result.error);
        return;
    }

    const orderId = Number(result.data.orderId);  // Convertimos orderId a número para usar en consultas

    try {
        await prisma.orderProducts.deleteMany({
            where: {
                orderId: orderId
            }
        });

        await prisma.payment.delete({
            where: {
                orderId: orderId
            }
        });

        await prisma.order.delete({
            where: {
                id: orderId
            }
        });

        // Actualiza la página para reflejar los cambios
        revalidatePath('/admin/orders');
        
    } catch (error) {
        console.error('Error deleting order:', error);
    } 
}

