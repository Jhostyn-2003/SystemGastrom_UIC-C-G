"use client"

import { useState } from "react";
import { useStore } from "@/src/store"
import ProductDetails from "./ProductDetails"
import { useMemo } from "react"
import { formatCurrecy } from "@/src/utils"
import { createOrder } from "@/actions/create-order-action"
import { OrderSchema } from "@/src/schema"
import { toast } from "react-toastify"

import ImageUploadOrder from './ImageUploadOrder';


export default function OrderSummary() {
  const order = useStore(state => state.order)
  const clearOrder = useStore(state => state.clearOrder)
  //const total = useMemo(() => order.reduce((total, item) => total + (item.quantity * item.price), 0), [order])

   // Estado para el método de pago y detalles de la imagen
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [transferImage, setTransferImage] = useState<string>("");
  const [paymentDescription, setPaymentDescription] = useState<string>("");


  //Calculo del total del pedido con descuento de las entradas y segundos
  const total = useMemo(() => {
    let totalAmount = 0;
    let entréeCount = 0;
    let mainCourseCount = 0;
    let otherCategoryTotal = 0;

    order.forEach((item) => {
      if (item.categoryId === 4) {
        entréeCount += item.quantity;
      } else if (item.categoryId === 5) {
        mainCourseCount += item.quantity;
      } else {
        otherCategoryTotal += item.quantity * item.price;
      }
    });

    // Aplicar descuentos según la combinación de platos
    const minCount = Math.min(entréeCount, mainCourseCount);
    const maxCount = Math.max(entréeCount, mainCourseCount);
    const diffCount = maxCount - minCount;

    // Si la cantidad de entradas y segundos son iguales, se aplica el descuento
    if (entréeCount === mainCourseCount) {
      totalAmount = minCount * 2.50; // Almuerzo por 2.50 dólares
    } else {
      // Si no son iguales, se aplica el precio por defecto
      totalAmount = minCount * 2.50 + diffCount * 2; // Almuerzo por 2.50 dólares y los platos adicionales por 2 dólares
    }

    // Sumar el total de otras categorías (bebidas u otros)
    totalAmount += otherCategoryTotal;

    return totalAmount;
  }, [order]);


  //Imagenes del Formulario efectivo o trasferencia 
  // Función para manejar la carga de la imagen
  const handleImageUpload = (imageUrl: string) => {
    setTransferImage(imageUrl); // Actualiza el estado de transferImage con la URL de la imagen cargada
};

// Función para crear el pedido
const handleCreateOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!paymentMethod) {
        toast.error("Seleccione un método de pago.");
        return;
    }

    const data = {
        name: event.currentTarget.name.value,
        total,
        order,
        paymentMethod,
        transferImage: paymentMethod === "transferencia" ? transferImage : "", // Usa transferImage si es transferencia
        paymentDescription,  // Siempre asigna paymentDescription
    };

    const result = OrderSchema.safeParse(data);

    if (!result.success) {
        result.error.issues.forEach((issue) => {
            toast.error(issue.message);
        });
        return;
    }

    const response = await createOrder(data);

    if (response?.errors) {
        response.errors.forEach((issue) => {
            toast.error(issue.message);
        });
        return;
    }

    toast.success("Pedido creado con éxito");
    clearOrder();
    setPaymentMethod(null);
    setTransferImage("");
    setPaymentDescription("");
};


  /*
    //verificacion de la validacion del nombre 
    const handleCreateOrder = async (formData: FormData) =>{
      console.log('Form data:', formData);
      const data ={
        name: formData.get('name'),
        total,
        order
      }
  
      console.log('Data to send:', data);
  
      //Validacion del formulario (Cliente) -- mesaje notificacion 
      const result = OrderSchema.safeParse(data)
      if(!result.success){
        result.error.issues.forEach((issue) =>{
          toast.error(issue.message)
        })
        return 
      }
  
      //validacion en el servidior notificacion
      const response = await createOrder(data)
      if(response?.errors){
        response.errors.forEach((issue) =>{
          toast.error(issue.message)
        })
      }
  
      toast.success('Pedido creado con exito')
      clearOrder()
  
    }
  */

  return (
    <aside className="lg:h-screen lg:overflow-y-scroll md:w-64 lg:w-96 p-5">
      <h1 className="text-4xl text-center font-black">Mi Pedido</h1>

      {order.length === 0 ? <p className="text-center my-10">El pedido esta vacío</p> : (
        <div className="mt-5">
          {order.map(item => (
            <ProductDetails
              key={item.id}
              item={item}
            />
          ))}

          <p className="text-2xl mt-20 text-center">
            Total a pagar : {''}
            <span className="font-bold ">{formatCurrecy(total)}</span>
          </p>

          <form className="w-full mt-10 space-y-5" onSubmit={handleCreateOrder}>
                        <input
                            type="text"
                            placeholder="Tu Nombre"
                            className="bg-white border border-gray-100 p-2 w-full"
                            name="name"
                        />

                        <div className="flex items-center justify-between space-x-4">
                            <label className="block">Método de Pago:</label>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className={`py-2 rounded uppercase text-white bg-black w-full text-center cursor-pointer ${paymentMethod === "transferencia" ? "bg-gray-800" : ""}`}
                                    onClick={() => setPaymentMethod("transferencia")}
                                >
                                    Transferencia Bancaria
                                </button>
                                <button
                                    type="button"
                                    className={`py-2 rounded uppercase text-white bg-black w-full text-center cursor-pointer ${paymentMethod === "efectivo" ? "bg-gray-800" : ""}`}
                                    onClick={() => setPaymentMethod("efectivo")}
                                >
                                    Efectivo
                                </button>
                            </div>
                        </div>

                        {paymentMethod === "transferencia" && (
                            <div className="space-y-2">
                                <label>Imagen de Transferencia:</label>
                                <ImageUploadOrder onUpload={handleImageUpload} />
                                <textarea
                                    placeholder="Descripción del Pago en Transferencia"
                                    className="bg-white border border-gray-100 p-2 w-full"
                                    value={paymentDescription}
                                    onChange={(e) => setPaymentDescription(e.target.value)}
                                />
                            </div>
                        )}

                        {paymentMethod === "efectivo" && (
                            <textarea
                                placeholder="Descripción del Pago en Efectivo"
                                className="bg-white border border-gray-100 p-2 w-full"
                                value={paymentDescription}
                                onChange={(e) => setPaymentDescription(e.target.value)}
                            />
                        )}

                        <input
                            type="submit"
                            className="py-2 rounded uppercase text-white bg-black w-full text-center cursor-pointer"
                            value="Confirmar Pedido"
                        />
                    </form>

          { /* 
          <form 
            className="w-full mt-10 space-y-5"
            action={handleCreateOrder}
          >
           <input type="text"
              placeholder="Tu Nombre"
              className="bg-white border border-gray-100 p-2 w-full"
              name="name"
           />

            <input type="submit"
              className="py-2 rounded uppercase text-white bg-black w-full text-center cursor-pointer "
              value="Confirmar Pedido"
            />
          </form>
*/   }
        </div>
      )}
    </aside>
  )
}
