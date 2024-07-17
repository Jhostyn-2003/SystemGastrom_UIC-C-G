import { z } from 'zod'

export const OrderSchema = z.object({
    name: z.string()
              .min(1, 'El nombre es requerido'),
    total: z.number().min(0.01, 'El total debe ser mayor a 0'),
    order: z.array(z.object({
        id: z.number(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        subtotal: z.number()
    })),
    paymentMethod: z.string().nonempty('El método de pago es requerido'),
    transferImage: z.string().optional(),
    paymentDescription: z.string().min(1, 'La descripción de Pago es requerida'),
    chatId: z.string().optional(), // Agregar el campo chatId
    table: z.string().optional() // Agregar el campo table
})

export const OrderIdSchema = z.object({
    orderId: z.string()
                .transform((value) => parseInt(value))
                .refine(value => value > 0, {message: 'Hay errores'})
})

//esquema de busqueda
export const SearchSchema = z.object({
    search: z.string()
              .trim()
              .min(1, {message: 'La búsqueda no puede ir vacia'})
})

// Validación del Formulario de Agregar
export const ProductSchema = z.object({
    name: z.string()
        .trim()
        .min(1, { message: 'El Nombre del Producto no puede ir vacio'}),
    price: z.string() // Asegúrate de que price sea un número después de la transformación
        .trim()
        .transform((value) => parseFloat(value))
        .refine((value) => value > 0, { message: 'Precio no válido' })
        .or(z.number().min(0.01, { message: 'Precio no válido' })),
    categoryId: z.string()
        .trim()
        .transform((value) => parseInt(value))
        .refine((value) => value > 0, { message: 'La Categoría es Obligatoria' })
        .or(z.number().min(1, {message: 'La Categoría es Obligatoria' })),
    image: z.string().min(1, {message: 'La Imagen es Obligatoria'})
})