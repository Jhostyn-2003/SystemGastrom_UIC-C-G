import { create } from 'zustand';
import { OrderItem } from './types';
import { Product } from '@prisma/client';
import { toast } from 'react-toastify'; // Importa toast

interface Store {
    order: OrderItem[];
    updateStock: (id: Product['id'], quantityChange: number) => void;
    addToOrder: (product: Product) => void;
    increaseQuantity: (id: Product['id']) => void;
    decreaseQuantity: (id: Product['id']) => void;
    removeItem: (id: Product['id']) => void;
    clearOrder: () => void;
}

export const useStore = create<Store>((set, get) => ({
    order: [],
    updateStock: (id, quantityChange) => {
        const { order } = get();
        const updatedOrder = order.map(item =>
            item.id === id ? {
                ...item,
                stock: item.stock !== null ? item.stock + quantityChange : item.stock // No modificar stock si es null
            } : item
        );
        set({ order: updatedOrder });
    },
    addToOrder: (product) => {
        const { categoryId, image, ...data } = product;
        const existingOrder = get().order.find(item => item.id === product.id);

        let order: OrderItem[] = [];

        if (existingOrder) {
            const updatedOrder = get().order.map(item => item.id === product.id ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: item.price * (item.quantity + 1),
                stock: item.stock !== null ? item.stock - 1 : null // No modificar stock si es null
            } : item);

            order = updatedOrder;
        } else {
            order = [...get().order, {
                ...data,
                categoryId,
                quantity: 1,
                subtotal: product.price,
                stock: product.stock !== null ? product.stock - 1 : null // No modificar stock si es null
            }];
        }

        set({ order });
    },
    increaseQuantity: (id) => {
        const { order } = get();
        const itemToUpdate = order.find(item => item.id === id);

        if (itemToUpdate) {
            if (itemToUpdate.stock === 0) {
                toast.error('No hay suficiente stock para incrementar la cantidad');
            } else {
                const updatedOrder = order.map(item => item.id === id ? {
                    ...item,
                    quantity: item.quantity + 1,
                    subtotal: item.price * (item.quantity + 1),
                    stock: item.stock !== null ? item.stock - 1 : item.stock // No modificar stock si es null
                } : item);

                set({ order: updatedOrder });
            }
        } else {
            toast.error('El item no fue encontrado en la orden');
        }
    },
    decreaseQuantity: (id) => {
        const { order } = get();
        const itemToUpdate = order.find(item => item.id === id);

        if (itemToUpdate && itemToUpdate.quantity > 1) {
            const updatedOrder = order.map(item => item.id === id ? {
                ...item,
                quantity: item.quantity - 1,
                subtotal: item.price * (item.quantity - 1),
                stock: item.stock !== null ? item.stock + 1 : item.stock // No modificar stock si es null
            } : item);

            set({ order: updatedOrder });
        } else {
            toast.error('No se puede disminuir la cantidad del pedido');
        }
    },
    removeItem: (id) => {
        const { order } = get();
        const itemToRemove = order.find(item => item.id === id);

        if (itemToRemove) {
            const updatedOrder = order.filter(item => item.id !== id);
            set({ order: updatedOrder });
        }
    },
    clearOrder: () => {
        set({ order: [] });
    }
}));








/*import {create} from 'zustand';
import { OrderItem } from './types';
import { Product } from '@prisma/client';


interface Store{
    order : OrderItem[]
    addToOrder: (product : Product)=> void
    increaseQuantity: (id: Product ['id']) => void
    decreaseQuantity: (id: Product ['id']) => void
    removeItem: (id: Product['id']) => void
    clearOrder: () => void
}

export const useStore = create<Store>((set, get)=> ({
    order : [],
    addToOrder: (product) => {

        const {categoryId, image, ...data} = product;
        let order : OrderItem[] = [];

        if(get().order.find(item => item.id === product.id) ){
            order = get().order.map(item => item.id === product.id ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: item.price *(item.quantity + 1)
            } :item )

        }else{
            order = [...get().order, {
                ...data,
                categoryId ,// se agrego este solo para el descuento del plato se lo puede eliminar
                quantity: 1,
                subtotal: 1* product.price
            }]
        }

        set(() => ({
            order
        }))
    },
    increaseQuantity: (id) => {

        set((state) => ({
            order : state.order.map(item => item.id === id ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: item.price *(item.quantity + 1)
            } :item )
        }))
    },
    decreaseQuantity: (id) => {

        const order = get().order.map( item => item.id === id ? {
            ...item,
            quantity: item.quantity - 1,
            subtotal: item.price * (item.quantity - 1)
        }: item)

        set(() => ({
            order
        }))
    },
     removeItem: (id) =>{

        set((state) => ({
            order: state.order.filter(item => item.id !== id)
        }))
     },
        clearOrder: () => {
            set(() => ({
                order: []
            }))
        }


}));
*/

