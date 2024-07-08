import ProductSearchForm from "@/components/products/ProductSearchForm";
import ProductsPagination from "@/components/products/ProductsPagination";
import ProductTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import ExportToPdf from "@/components/report/ExportToPdf"; // Importa el componente pdf
import ExportToExcel from "@/components/report/ExportToExcel";

async function productCount() {
    return await prisma.product.count()
}


async function getProducts(page: number, pageSize: number) {

    const skip = (page - 1) * pageSize

    const products = await prisma.product.findMany({
        //este take es para que aparesca solo 10 productos.
        take: pageSize,
        skip: skip,
        //este include es para que aparesca la categoria en los productos.
        include: {
            category: true
        }
    })

    return products
}

//Para obtenr todos los productos
async function getAllProducts() {
    const products = await prisma.product.findMany({
        include: {
            category: true
        }
    });
    return products;
}


//este exporta la categoria que esta relaciona en los productos y aparesca de manera correcta. 
export type ProductsWithCategory = Awaited<ReturnType<typeof getProducts>>


export default async function ProductsPage({ searchParams }: { searchParams: { page: string } }) {

    const page = +searchParams.page || 1
    const pageSize = 10

    if (page < 0) redirect('/admin/products')

    const productsData = getProducts(page, pageSize)
    const totalProductsData = productCount()
    const allProductsData = getAllProducts()
    const [products, totalProducts, allProducts] = await Promise.all([productsData, totalProductsData, allProductsData])
    const totalPages = Math.ceil(totalProducts / pageSize)

    if (page > totalPages) redirect('/admin/products')

    return (
        <>
            <Heading>Administrar Productos</Heading>

            <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
                <Link
                    href={'/admin/products/new'}
                    className="bg-sky-900 hover:bg-indigo-800 text-white w-full lg:w-auto text-xl px-10 py-3 text-center font-bold cursor-pointer"
                >Crear Producto</Link>

                <ProductSearchForm />
            </div>

            <div className="flex flex-col lg:flex-row lg:justify-end gap-5 mt-2">
  <div className="flex items-center lg:justify-end gap-3">
    <ExportToPdf data={allProducts} /> {/* Botón de exportar a PDF */}
    <ExportToExcel data={allProducts} /> {/* Botón de exportar a Excel */}
  </div>
</div>



            <ProductTable
                products={products}
            />

            <ProductsPagination
                page={page}
                totalPages={totalPages}
            />

        </>
    )
}
