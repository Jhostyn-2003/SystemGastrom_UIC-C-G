import { prisma } from "@/src/lib/prisma"
import ImageUpload from "./ImageUpload"
import { Product } from "@prisma/client"


async function getCategories() {
    return prisma.category.findMany();
}

//Para pasar los productos cuando se actualiza en el form
type ProductFormProps = {
    // ? -> opcional permite verificar tanto para editar y agregar con el default
    product?: Product
}

export default async function ProductForm({product}: ProductFormProps) {

    const categories = await getCategories()

    return (
        <>
            <div className="space-y-2">
                <label
                    className="text-slate-800"
                    htmlFor="name"
                >Nombre:</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Nombre Producto"
                    defaultValue={product?.name}
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-slate-800"
                    htmlFor="price"
                >Precio:</label>
                <input
                    id="price"
                    name="price"
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Precio Producto"
                    defaultValue={product?.price}
                />
            </div>

            <div className="space-y-2">
                <label
                    className="text-slate-800"
                    htmlFor="categoryId"
                >Categoría:</label>
                <select
                    className="block w-full p-3 bg-slate-100"
                    id="categoryId"
                    name="categoryId"
                    defaultValue={product?.categoryId}
                >
                    <option value="">-- Seleccione --</option>
                    {categories.map(category => (
                        <option
                            key={category.id}
                            value={category.id}
                        >{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label
                    className="text-slate-800"
                    htmlFor="stock"
                >Stock:</label>
                <input
                    id="stock"
                    name="stock"
                    className="block w-full p-3 bg-slate-100"
                    placeholder="Stock del Producto"
                    defaultValue={product?.stock ?? ''}
                />
            </div>

            <ImageUpload
                image={product?.image}
            />
        </>
    )
}