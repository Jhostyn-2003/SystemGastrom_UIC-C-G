import { FiBox, FiShoppingCart, FiClipboard, FiCheckCircle } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: number;
}

export default function StatCard({ title, value }: Readonly<StatCardProps>) {
  let Icon = FiBox;
  let backgroundColor = '#3182CE'; // Azul

  // Selecciona el icono y el color de fondo según el título de la tarjeta
  switch (title) {
    case "Total Categorias":
      Icon = FiClipboard;
      backgroundColor = '#F6AD55'; // Naranja
      break;
    case "Ordenes Pendiente":
      Icon = FiShoppingCart;
      backgroundColor = '#E53E3E'; // Rojo
      break;
    case "Ordenes Listas":
      Icon = FiCheckCircle;
      backgroundColor = '#48BB78'; // Verde
      break;
  }

  return (
    <div className='bg-white flex justify-between w-full border p-4 rounded-lg'>
      <div className='flex items-center'>
        <div className='rounded-full bg-blue-200 p-2 mr-4'>
          {/* Icono con cuadro de color de fondo */}
          <div style={{ backgroundColor }} className='rounded-full p-1'>
            <Icon size={24} color='white' />
          </div>
        </div>
        <div className='flex flex-col w-full'>
          <p className='text-2xl font-bold'>{value}</p>
          <p className='text-gray-600 font-semibold'>{title}</p>
        </div>
      </div>
    </div>
  );
}