import { prisma } from "@/src/lib/prisma"

//Para que los Endpoint sea dinamicos y no se queden cache 
export const dynamic = 'force-dynamic'

export async function GET(){

    const orders = await prisma.order.findMany({
        where: {
            status: false
        },
        include: {
            orderProducts: {
                include: {
                    product: true
                }
            },
            
            payment: true // Incluir la relación con Payment si existe
        }
    })

    return Response.json(orders)
}
