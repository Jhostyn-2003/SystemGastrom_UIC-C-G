"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

// Define los tipos de las props que aceptará el componente
interface ImageUploadOrderProps {
    onUpload: (imageUrl: string) => void;
}

const ImageUploadOrder: React.FC<ImageUploadOrderProps> = ({ onUpload }) => {
    const [imageUrl, setImageUrl] = useState("");

    const handleUpload = useCallback((secureUrl: string) => {
        setImageUrl(secureUrl);
        // Llama al callback `onUpload` pasado como prop
        onUpload(secureUrl);
    }, [onUpload]);

    return (
        <CldUploadWidget
            onSuccess={(result, { widget }) => {
                if (result.event === "success") {
                    widget.close();
                    //@ts-ignore
                    const secureUrl = result.info?.secure_url || "";
                    handleUpload(secureUrl);
                }
            }}
            uploadPreset="sg0ovu0b"
            options={{
                maxFiles: 1,
            }}
        >
            {({ open }) => (
                <>
                    <div className="space-y-2">
                        <button
                            className="relative cursor-pointer hover:opacity-70 transition p-10 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600 bg-slate-100"
                            onClick={() => open()}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    open();
                                }
                            }}
                        >
                            <TbPhotoPlus size={50} />
                            <p className="text-lg font-semibold">Agregar Imagen</p>

                            {imageUrl && (
                                <div className="absolute inset-0 w-full h-full">
                                    <Image
                                        fill
                                        style={{ objectFit: "contain" }}
                                        src={imageUrl}
                                        alt="Imagen de Producto"
                                    />
                                </div>
                            )}
                        </button>
                    </div>
                    <input type="hidden" name="transferImage" value={imageUrl} />
                </>
            )}
        </CldUploadWidget>
    );
}

export default ImageUploadOrder;
