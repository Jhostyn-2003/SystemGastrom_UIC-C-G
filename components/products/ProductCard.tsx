import { formatCurrecy, getImagePath } from "@/src/utils"
import { Product } from "@prisma/client"
import Image from "next/image"
import AddProductButton from "./AddProductButton"

type ProductCardProps = {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {

    const imagePath = getImagePath(product.image)

    return (
        <div className="border bg-white rounded-lg overflow-hidden shadow-md">
            <div className="relative">
                <Image
                    className="object-cover w-full h-72"
                    src={imagePath}
                    alt={`Imagen platillo ${product.name}`}
                    width={400}
                    height={500}
                />
            </div>

            <div className="p-5">
                <h3 className="text-2xl font-bold">{product.name}</h3>
                <p className="mt-5 font-black text-4xl text-amber-500">
                    {formatCurrecy(product.price)}
                </p>
                {product.stock > 0 &&
                    <p className="mt-2 text-xl font-bold bg-green-200 rounded-lg p-2">Stock: {product.stock}</p>
                }
                <AddProductButton
                    product={product}
                />
            </div>

        </div>
    )
}
