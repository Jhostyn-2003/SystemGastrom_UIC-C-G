import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

interface TelegramResponse {
    ok: boolean;
    result?: any;
    description?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN_MESA3;
        const { chatId, ...orderData } = req.body;

        if (!token) {
            throw new Error('El token de Telegram no está definido');
        }

        const message = formatTelegramMessage(orderData);

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error en la respuesta de Telegram:', errorData);
            throw new Error(errorData || 'Error al enviar el pedido al bot de Telegram');
        }

        const rawData = await response.json();
        const data: TelegramResponse = rawData as TelegramResponse;

        if (data.ok) {
            setTimeout(async () => {
                const followUpMessage = "Tu orden está siendo procesada ⏳, recuerda si es un pago en Efectivo deberás acercarte a caja a pagar, si tu pago es transferencia bancaria espera a que verifiquen tu pago 🧐.";
                const followUpResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: followUpMessage,
                    }),
                });

                if (!followUpResponse.ok) {
                    const errorData = await followUpResponse.text();
                    console.error('Error en la respuesta de Telegram:', errorData);
                    throw new Error(errorData || 'Error al enviar el mensaje de seguimiento al bot de Telegram');
                }

                res.status(200).json({message: 'Pedido y mensaje de seguimiento enviados al bot de Telegram'});
            }, 5000);
        } else {
            console.error('Error en la respuesta de Telegram:', data);
            throw new Error(data.description || 'Error al enviar el pedido al bot de Telegram');
        }

    } catch (error: unknown) {
        console.error('Error en el handler de Telegram:', error);
        res.status(500).json({ error: (error as Error).message });
    }
}

function formatTelegramMessage(orderData: any): string {
    const { name, total, order, paymentMethod, paymentDescription, table } = orderData;

    let message = `Nuevo pedido recibido 📋:\n\n`;
    message += `Cliente 👤: ${name}\n`;
    message += `Mesa 🍱: ${table}\n\n`;
    message += `Detalles del pedido 🖊:\n`;

    order.forEach((item: any, index: number) => {
        message += `\n${index + 1}. ${item.name}\n`;
        message += `Cantidad: ${item.quantity}\n`;
        message += `Subtotal: ${item.subtotal}$\n`;
    });

    message += `\nTotal a pagar: ${total}$\n`;
    message += `Método de pago: ${paymentMethod}\n`;
    message += `Descripción del pago: ${paymentDescription}\n`;

    return message;
}