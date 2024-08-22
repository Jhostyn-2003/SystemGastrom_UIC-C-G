"use client";

import { ProductSchema } from "@/src/schema";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/actions/update-product-action";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function EditProductForm({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío

    const params = useParams();
    const id = params && params.id ? +params.id : null;

    if (id === null) {
        console.error('ID del producto no encontrado.');
        return null; // Asegúrate de retornar null o algún componente de error
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        setIsSubmitting(true); // Desactivar el botón al iniciar el envío

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get('name'),
            price: formData.get('price'),
            categoryId: formData.get('categoryId'),
            stock: formData.get('stock'),
            image: formData.get('image'),
        };

        const result = ProductSchema.safeParse(data);

        if (!result.success) {
            result.error.issues.forEach(issue => {
                toast.error(issue.message);
            });
            setIsSubmitting(false); // Reactivar el botón si hay error
            return;
        }

        const response = await updateProduct(result.data, id);
        if (response?.errors) {
            response.errors.forEach(issue => {
                toast.error(issue.message);
            });
            setIsSubmitting(false); // Reactivar el botón si hay error
            return;
        }

        toast.success('Producto Actualizado Correctamente');
        router.push('/admin/products');
    };

    return (
        <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md max-w-3xl mx-auto">
            <form
                className="space-y-5"
                onSubmit={handleSubmit} // Usar onSubmit en lugar de action
            >
                {children}

                <input
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
                    value={isSubmitting ? 'Guardando Cambios...' : 'Guardar Cambios'}
                    disabled={isSubmitting} // Desactivar el botón si se está enviando
                />
            </form>
        </div>
    );
}
