// send-message-delete-to-telegram.ts

import fetch from 'node-fetch';

export const sendDeleteMessageToTelegram = async (chatId: string, reason: string) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            throw new Error('El token de Telegram no está definido');
        }

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        let message = '';
        switch (reason) {
            case 'image_not_clear':
                message = 'La imagen no es legible, cree su orden nuevamente';
                break;
            case 'invalid_payment_proof':
                message = 'Su comprobante de pago no es válido, intente nuevamente';
                break;
            case 'payment_timeout':
                message = 'Tiempo de espera en el pago excedido, cree su orden nuevamente';
                break;
            default:
                // No se envía ningún mensaje si no hay motivo específico seleccionado
                return;
        }

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
            throw new Error(errorData || 'Error al enviar el mensaje al bot de Telegram');
        }

        console.log('Mensaje enviado a Telegram:', message);
    } catch (error) {
        console.error('Error al enviar el mensaje a Telegram:', error);
    }
};
