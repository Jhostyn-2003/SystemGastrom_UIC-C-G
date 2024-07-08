import ProductCard from "@/components/products/ProductCard"
import Heading from "@/components/ui/Heading"
import { prisma } from "@/src/lib/prisma"

async function getProducts(category : string){
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: category
      }
    }
  })
  return products
}

export default async function OrderPage({params} : {params: {category: string}}) {
  const products = await getProducts(params.category)
  

    return (
      <>
        <Heading>
          Elige y Personaliza tu pedido a continuación 
        </Heading>
       {/* Aqui se verifica para las categorias de las paginas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 items-start">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </>
    )
  }
  