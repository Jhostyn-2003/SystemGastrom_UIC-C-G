// create-order-action.ts

"use server"

import { prisma } from "@/src/lib/prisma";
import { OrderSchema } from "@/src/schema";

export async function createOrder(data: unknown) {
    console.log("Data received in createOrder:", data); // Log para mostrar los datos recibidos

    const result = OrderSchema.safeParse(data);

    if (!result.success) {
        return {
            errors: result.error.issues.map(issue => ({
                message: issue.message,
            })),
        };
    }

    try {
        const orderData = {
            name: result.data.name,
            total: result.data.total,
            orderProducts: {
                create: result.data.order.map((product: any) => ({
                    productId: product.id,
                    quantity: product.quantity,
                })),
            },
            chatID: result.data.chatId, // Ensure chatID is included
        };

        console.log("Order data to save:", orderData); // Log para mostrar los datos que se guardarán

        let createdOrder;

        // Crear la orden con los productos asociados y el pago
        createdOrder = await prisma.order.create({
            data: {
                ...orderData,
                payment: {
                    create: {
                        transferImage: result.data.transferImage || "", // Asegúrate de incluir transferImage siempre
                        description: result.data.paymentDescription || "", // Asegúrate de incluir description siempre
                    },
                },
            },
            include: {
                payment: true, // Incluir el objeto Payment relacionado en el resultado
            },
        });

        console.log("Created order:", createdOrder); // Log para mostrar la orden creada

        return { success: true, order: createdOrder };
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        throw new Error("Error al crear el pedido");
    }
}