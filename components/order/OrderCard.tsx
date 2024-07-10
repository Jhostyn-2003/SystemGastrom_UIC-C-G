// components/order/OrderCard.tsx
import { completeOrder } from "@/actions/complete-order-action"
import { deleteOrder } from "@/actions/delete-order-action"
import { OrderWithProducts } from "@/src/types"
import { formatCurrecy } from "@/src/utils"

//mensajes de eliminacion
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

//Para el modal
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import Modal from 'react-modal';
import { getImagePathTipos } from '@/src/utils'; // Asegúrate de importar la función getImagePathTipos adecuadamente

type OrderCardProps = {
    order: OrderWithProducts
}

export default function OrderCard({ order }: OrderCardProps) {

    //Modal
    const [modalOpen, setModalOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    //Constante para eliminar
    const handleDeleteOrder = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        confirmAlert({
            title: 'Confirmación',
            message: '¿Estás seguro que deseas eliminar esta orden?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        const formData = new FormData(event.target as HTMLFormElement);
                        deleteOrder(formData);
                        toast.success('Orden eliminada correctamente');
                    }
                },
                {
                    label: 'No',
                    onClick: () => {
                        toast.error('Eliminación de orden cancelada');
                    }
                }
            ]
        });
    };

    const handleCompleteOrder = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        completeOrder(formData);
        toast.success('Orden marcada como completada');
    };

    return (
        <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-purple-200 hover:bg-purple-500 px-4 py-6 sm:p-6  lg:mt-0 lg:p-8 space-y-4"
        >
            <p className='text-2xl font-medium text-gray-900'>Cliente: {order.name}</p>
            <p className='text-lg font-medium text-gray-900'>Productos Ordenados:</p>
            <dl className="mt-6 space-y-4">
                {order.orderProducts.map(product => (
                    <div
                        key={product.id}
                        className="flex items-center gap-2 border-t border-gray-200 pt-4"
                    >
                        <dt className="flex items-center text-sm text-gray-600 ">
                            <span className="font-black"> ({product.quantity}) {''}</span>
                        </dt>
                        <dd className="text-sm font-medium text-gray-900">{product.product.name}</dd>
                    </div>
                ))}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium text-gray-900">Total a Pagar:</dt>
                    <dd className="text-base font-medium text-gray-900">{formatCurrecy(order.total)}</dd>
                </div>
            </dl>
            <p className="text-sm font-medium text-gray-500">Chat ID: {order.chatID ?? "No aplica"}</p>

            {/*Se agregala Funcionalidad para el Modal */}
            {/* Botón para abrir el modal */}
            <input
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
                value="Ver Detalles del Pago"
                onClick={handleOpenModal}
            />

            {/* Modal de Material-UI */}
            <Dialog
                fullScreen={fullScreen}
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Detalles del Pago</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Método de Pago: {order.payment ? (order.payment.description ?? 'Sin descripción') : 'No especificado'}
                    </DialogContentText>
                    {order.payment?.transferImage && (
                        <img
                            src={getImagePathTipos(order.payment.transferImage)}
                            alt="Imagen de Transferencia"
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            {/*Otros botones */}
            <form onSubmit={handleCompleteOrder}>
                <input
                    type="hidden"
                    value={order.id}
                    name="order_id"
                />
                <input
                    type="submit"
                    className="bg-sky-900 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer"
                    value='Marcar Orden Completada'
                />
            </form>
            {/* Formulario para eliminar la orden */}
            <form onSubmit={handleDeleteOrder}>
                <input
                    type="hidden"
                    value={order.id.toString()}
                    name="order_id"
                />
                <input
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white w-full mt-3 p-3 uppercase font-bold cursor-pointer"
                    value='Eliminar Orden'
                />
            </form>
        </section>
    )
}