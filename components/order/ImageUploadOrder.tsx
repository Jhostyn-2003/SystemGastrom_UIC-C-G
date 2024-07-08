"use client"

import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { useState } from "react"
import { TbPhotoPlus } from "react-icons/tb"

export default function ImageUploadOrder({ onUpload }: { onUpload: (imageUrl: string) => void }) {
    const [imageUrl, setImageUrl] = useState('')

    const handleImageUpload = (imageUrl: string) => {
        setImageUrl(imageUrl); // Actualiza el estado de imageUrl con la URL de la imagen cargada
        onUpload(imageUrl); // Llama a la función onUpload para pasar la URL al componente padre
    };

    return (
        <CldUploadWidget 
            onSuccess={(result, { widget }) => {
                if (result.event === 'success') {
                    widget.close()
                    //@ts-ignore
                    const secureUrl = result.info?.secure_url || '';
                    setImageUrl(secureUrl);
                    onUpload(secureUrl); // Asegúrate de pasar la URL al componente padre en onSuccess
                }
            }}
            uploadPreset="sg0ovu0b"
            options={{
                maxFiles: 1
            }}
        >
            {({ open }) => (
                <>
                   <div className="space-y-2">
                        
                        <div 
                            className="relative cursor-pointer hover:opacity-70 transition p-10 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600 bg-slate-100 "
                            onClick={() => open()}
                        >
                            <TbPhotoPlus
                                size={50}
                            />
                            <p className="text-lg font-semibold">Agregar Imagen</p>

                            {imageUrl && (
                                <div
                                    className="absolute inset-0 w-full h-full"
                                >
                                    <Image
                                        fill
                                        style={{objectFit: 'contain'}}
                                        src={imageUrl}
                                        alt="Imagen de Producto"
                                    />
                                </div>
                            )}

                        </div>
                    </div>
                    <input 
                        type='hidden'
                        name='transferImage'
                        value={imageUrl} 
                    />
                </>
            )}
        </CldUploadWidget>
    )
}
