// Funcionalidad Correcta para el eliminar
"use client"

import { deleteProduct } from "@/actions/delete-product-action";
import { confirmAlert } from 'react-confirm-alert'; // Importa react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Estilos por defecto de react-confirm-alert
import { toast } from "react-toastify";

export default function DeleteProductButton({ productId }: { productId: number }) {
    const handleDelete = async () => {
        confirmAlert({
            title: 'Confirmar eliminación',
            message: '¿Estás seguro de que deseas eliminar este producto?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: async () => {
                        try {
                            await deleteProduct(productId);
                            toast.success('Producto eliminado con éxito');
                            // Actualizar la lista de productos o redirigir al usuario
                        } catch (error) {
                            toast.error('Error al eliminar el producto');
                        }
                    }
                },
                {
                    label: 'No',
                    onClick: () => {} // No hacer nada si el usuario decide no eliminar
                }
            ]
        });
    }

    return (
        <button
            onClick={handleDelete}
            className="ml-2 text-red-600 hover:text-red-800"
        >
            Eliminar
        </button>
    )
}
