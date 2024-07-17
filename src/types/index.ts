import { Order, OrderProducts, Product, Payment } from '@prisma/client';

//se agrego categoria ID sii no funciona eliminar
export type OrderItem = Pick<Product, 'id' | 'name' | 'price' | 'categoryId'> & {
    quantity: number;
    subtotal: number;
}

export type OrderWithProducts = Order & {
    orderProducts: (OrderProducts & {
        product: Product
    })[];
    //se agrega el metodo de pago
    payment: Payment | null; // Asegúrate de que la propiedad payment esté definida
    chatID?: string; // Nuevo campo opcional para el ID de chat
    table?: string; // Nuevo campo opcional para el número de mesa
}