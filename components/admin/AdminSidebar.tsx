import Logo from "../ui/Logo"
import AdminRoute from "./AdminRoute"

const adminNavigation = [
    {url: '/admin/dashboard', text: 'Dashboard', blank: false},
    {url: '/admin/orders', text: 'Ordenes', blank: false},
    {url: '/admin/products', text: 'Productos', blank: false},
    {url: '/order/bebida', text: 'Ver Menú', blank: true},
]

export default function AdminSidebar() {

    return (
        <>
            {/*Importacion del logo del Sistema */}
            <Logo/>

            {/*Menu de Navegación del Sistema */}
            <div className="space-y-3 ">
                <p className="mt-10 uppercase font-bold text-sm text-gray-600 text-center">Navegación</p>
                <nav className="flex flex-col">
                    {adminNavigation.map(link => (
                        <AdminRoute
                            key={link.url}
                            link={link}
                        />

                    ))}
                </nav>
            </div>
        </>

    )
}