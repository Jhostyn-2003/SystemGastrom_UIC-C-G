
export function formatCurrecy(amount : number){
    return new Intl.NumberFormat('es-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

//Verifica si la imagen proviene del public o cloudinary 
export function getImagePath (imagePath: string){
    const cloudinaryBaseUrl = 'https://res.cloudinary.com'
    if(imagePath.startsWith(cloudinaryBaseUrl)){
        return imagePath
    }else{
        return `/products/${imagePath}.jpg`
    }
} 

//Para imagenes de cualquier tipo 
export function getImagePathTipos(imagePath: string): string {
    const cloudinaryBaseUrl = 'https://res.cloudinary.com';

    // Verificar si la imagen proviene de Cloudinary
    if (imagePath.startsWith(cloudinaryBaseUrl)) {
        return imagePath;
    } else {
        // Obtener la extensión de la imagen
        const extension = imagePath.split('.').pop()?.toLowerCase();

        // Generar el path según la extensión
        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return `/products/${imagePath}`; // Asumiendo que las imágenes locales están en la carpeta /products/
            default:
                // Si la extensión no es reconocida, devolver directamente el imagePath
                return imagePath;
        }
    }
}



// Para verificar el tiempo 
export const formatLocalTime = (utcDate: string) => {
    const date = new Date(utcDate);
    const options = { timeZone: 'America/Guayaquil', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString('es-EC', options);
  };
  