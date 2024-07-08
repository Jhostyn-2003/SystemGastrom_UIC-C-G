import { prisma } from "@/src/lib/prisma";

//Para que los Endpoint sea dinamicos y no se queden cache 
export const dynamic = 'force-dynamic'


export async function GET(){
    const orders = await prisma.order.findMany({
        take: 5, 
        where: {
            orderReadyAt: {
                not: null
            }
        }, 
        orderBy: {
            orderReadyAt: 'desc'
        },
        include: {
            orderProducts: {
                include: {
                    product: true
                }
            }
        }
        
    })

    return Response.json(orders)
}
