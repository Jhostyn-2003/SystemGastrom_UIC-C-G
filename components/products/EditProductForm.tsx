"use client"

import { ProductSchema } from "@/src/schema";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/actions/update-product-action";
import { useParams } from "next/navigation";

export default function EditProductForm({children}: {children: React.ReactNode}) {

    const router = useRouter()


    // Constante para guardar los cambios al momento de editar
    const params = useParams();
    // Verifica si params es null o si params.id es undefined antes de intentar convertirlo a número
    const id = params && params.id ? +params.id : null;

    // Si id es null, maneja el caso adecuadamente (por ejemplo, redirigiendo o mostrando un mensaje de error)
    if (id === null) {
        // Redirige al usuario o muestra un mensaje de error
        console.error('ID del producto no encontrado.');
        // Ejemplo de redirección: router.push('/ruta-a-redirigir');
        return null; // Asegúrate de retornar null o algún componente de error para evitar que el resto del componente se ejecute
    }


    const handleSubmit = async (formData: FormData) =>{
       const data = {
            name: formData.get('name'),
            price: formData.get('price'),
            categoryId: formData.get('categoryId'),
           
            image: formData.get('image')
       } 

       // Imprime los datos en la consola para depuración
       console.log("Data before validation:", data);
       
       const result = ProductSchema.safeParse(data)
       
       //validacion del toast 
       if(!result.success){
            result.error.issues.forEach(issue =>{
                toast.error(issue.message)
            })
            return 
       }

       const response = await updateProduct(result.data, id)
       if(response?.errors){
            response.errors.forEach(issue => {
                toast.error(issue.message)
            })
            return 
       }
       toast.success('Producto Actualizado Correctamente')
       router.push('/admin/products')
    }

  return (
    <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md max-w-3xl mx-auto">
        
        <form
            className="space-y-5"
            action={handleSubmit}
        >
            {children}

            <input 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
                value='Guardar Cambios'
            />
        </form>

    </div>
  )
}


