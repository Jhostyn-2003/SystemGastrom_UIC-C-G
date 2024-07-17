// pages/api/send-message-delete-to-telegram.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

interface TelegramResponse {
    ok: boolean;
    result?: any;
    description?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { chatId, message, table } = req.body;

        if (!table) {
            throw new Error('La mesa no está definida');
        }

        let token: string | undefined;

        switch (table) {
            case 'Mesa 1':
                token = process.env.TELEGRAM_BOT_TOKEN_MESA1;
                break;
            case 'Mesa 2':
                token = process.env.TELEGRAM_BOT_TOKEN_MESA2;
                break;
            case 'Mesa 3':
                token = process.env.TELEGRAM_BOT_TOKEN_MESA3;
                break;
            default:
                throw new Error('Mesa no válida');
        }

        if (!token) {
            throw new Error('El token de Telegram no está definido');
        }

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        const formattedMessage = message.split('\n').join('\n\n'); // Add double line breaks for spacing

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: formattedMessage,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error en la respuesta de Telegram:', errorData);
            throw new Error(errorData || 'Error al enviar el mensaje al bot de Telegram');
        }

        const rawData = await response.json();
        const data: TelegramResponse = rawData as TelegramResponse;

        if (data.ok) {
            res.status(200).json({ message: 'Mensaje enviado al bot de Telegram' });
        } else {
            console.error('Error en la respuesta de Telegram:', data);
            throw new Error(data.description || 'Error al enviar el mensaje al bot de Telegram');
        }

    } catch (error: unknown) {
        console.error('Error en el handler de Telegram:', error);
        res.status(500).json({ error: (error as Error).message });
    }
}
