
import Link from 'next/link';

type ProductsPaginationProps = {
    page: number
    totalPages: number
}


export default function ProductsPagination({ page, totalPages }: ProductsPaginationProps) {
    //paginador por numeros 
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)


    return (
        <nav className='flex justify-center py-10'>

            {page > 1 && (
                //Pagina anterior
                <Link
                    href={`/admin/products?page=${page - 1}`}
                    className='bg-white  px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0'
                >&laquo; </Link>
            )}

            {pages.map(currentPage => (
                //mostrar los numeros de la paginacion
                <Link
                    key={currentPage} //se añade por se acaso
                    href={`/admin/products?page=${currentPage}`}
                    className={`${page === currentPage && 'font-black'} bg-white  px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
                >{currentPage}</Link>
            ))}

            {page < totalPages && (

                //Pagina siguiente 
                <Link
                    href={`/admin/products?page=${page + 1}`}
                    className='bg-white  px-4 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0'
                >&raquo; </Link>
            )}

        </nav>
    )
}
