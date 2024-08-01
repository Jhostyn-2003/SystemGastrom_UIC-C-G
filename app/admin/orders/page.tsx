"use client"

import OrderCard from "@/components/order/OrderCard";
import Heading from "@/components/ui/Heading";
import { OrderWithProducts } from "@/src/types";
import useSWR from 'swr'


export default function OrdersPage() {

    const url = '/admin/orders/api'
    const fetcher = () => fetch(url).then(res => res.json()).then(data => data)
    const {data, isLoading} = useSWR<OrderWithProducts[]>(url, fetcher, {
        //cada minuto obtiene nuevo datos en las ordenes 
        refreshInterval: 60000,
        //cada vez que se vuelva a la pagina se actualiza
        revalidateOnFocus: false
    })

    
    if(isLoading) return <p>Cargando...</p>
  if(data) return (
    <>
      <Heading>Administrar Ordenes</Heading>

     

        {data.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5">
                {data.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                    />
                ))}
            </div>
        ): <p className="text-center">No hay ordenes pendientes</p>}
    </>
  )
}
