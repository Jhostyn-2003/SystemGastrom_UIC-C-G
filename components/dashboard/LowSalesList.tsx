// components/dashboard/LowSalesList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';

type LowSalesProduct = {
    category: string;
    product: string;
    quantity: number;
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

export default function LowSalesList() {
    const [products, setProducts] = useState<LowSalesProduct[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/productsMenos/categories');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                    if (data.length > 0) {
                        setSelectedCategory(data[0].slug); // Selecciona la primera categoría por defecto
                    }
                }
            } catch (error) {
                setCategories([]); // En caso de error, establece un array vacío
            }
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        if (!selectedCategory) return;

        async function fetchLowSalesProducts() {
            try {
                const response = await fetch(`/api/productsMenos/LowSalesList?categorySlug=${selectedCategory}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]); // Si la respuesta no es un array, establece un array vacío
                }
            } catch (error) {
                setProducts([]); // En caso de error, establece un array vacío
            }
        }

        fetchLowSalesProducts();
    }, [selectedCategory]);

    return (
        <div
            className="w-full col-span-1 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white overflow-scroll">
            <h2 className="text-xl font-semibold mb-4">Productos sin Demanda</h2>
            <label htmlFor="categorySelect" className="block mb-2">Seleccione una Categoría</label>
            <select
                id="categorySelect"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
            >
                {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                        {category.name}
                    </option>
                ))}
            </select>
            <ul className="space-y-2">
                {products.map((product, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                        <div className="flex items-center">
                            <FaArrowDown className="text-red-500 mr-2"/> {/* Ícono de bajo crecimiento */}
                            <span>{product.product}</span>
                        </div>
                        <span className="text-gray-500">{product.quantity} ventas</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
