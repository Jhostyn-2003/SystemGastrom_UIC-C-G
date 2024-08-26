import { formatCurrecy, getImagePath } from "@/src/utils";
import { Product } from "@prisma/client";
import Image from "next/image";
import AddProductButton from "./AddProductButton";

type ProductCardProps = {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const imagePath = getImagePath(product.image);

    return (
        <div className="flex flex-col border bg-white rounded-lg overflow-hidden shadow-md h-full">
            <div className="relative aspect-w-1 aspect-h-1">
                <Image
                    className="object-cover w-full h-full"
                    src={imagePath}
                    alt={`Imagen platillo ${product.name}`}
                    layout="responsive"
                    width={400}
                    height={400} // Asegura que la relación de aspecto se mantenga constante
                />
            </div>

            <div className="flex flex-col justify-between p-5 flex-grow">
                <h3 className="text-2xl font-bold">{product.name}</h3>
                <p className="mt-5 font-black text-4xl text-amber-500">
                    {formatCurrecy(product.price)}
                </p>
                {product.stock !== null && product.stock > 0 &&
                    <p className="mt-2 text-xl font-bold bg-green-200 rounded-lg p-2">Stock: {product.stock}</p>
                }
                <AddProductButton product={product} />
            </div>
        </div>
    );
}
