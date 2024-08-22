"use client"

import { useEffect, useState } from 'react';
import { useStore } from "@/src/store";
import { Product } from "@prisma/client";

type AddProductButtonProps = {
    product: Product;
}

export default function AddProductButton({product}: AddProductButtonProps) {
    const addToOrder = useStore(state => state.addToOrder);
    const order = useStore(state => state.order);
    const [isAdded, setIsAdded] = useState(false);

    // Verificar si el producto ya está en el carrito al inicio
    useEffect(() => {
        setIsAdded(order.some(item => item.id === product.id));
    }, [order, product.id]);

    const handleClick = () => {
        addToOrder(product);
        setIsAdded(true);
    }

    const isOutOfStock = product.stock === 0;

    return (
        <button
            type="button"
            className={`w-full mt-5 p-3 uppercase font-bold cursor-pointer ${isOutOfStock ? 'bg-red-500' : isAdded ? 'bg-green-500' : 'bg-sky-900 hover:bg-indigo-800'} text-white`}
            onClick={handleClick}
            disabled={isAdded || isOutOfStock}
        >
            {isOutOfStock ? 'No disponible' : isAdded ? 'Agregado' : 'Agregar'}
        </button>
    )
}


/*
import { useStore } from "@/src/store";
import { Product } from "@prisma/client";

type AddProductButtonProps = {
    product: Product;
}

export default function AddProductButton({product}: AddProductButtonProps) {
    const addToOrder = useStore(state => state.addToOrder);

    return (
        <button
            type="button"
            className="bg-sky-900 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
            onClick={()=> addToOrder(product)}
        >Agregar</button>
    )
}
*/