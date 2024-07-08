//app/admin/layout.tsx
import ToastNotification from "@/components/ui/ToastNotification";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="md:flex">
                <aside className="md:w-72 md:h-screen bg-white">
                    <AdminSidebar />
                    <div className="p-4">
                        <Button>
                            <Link href="/">
                                Regresar
                            </Link>
                        </Button>
                    </div>
                </aside>

                <main className="md:flex-1 md:h-screen md:overflow-y-scroll bg-gray-100 p-5">
                    {children}
                </main>
            </div>

            <ToastNotification />
        </>
    )
}