"use client"

import { useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaFilePdf } from 'react-icons/fa'; // Importar el ícono de PDF

interface Product {
  name: string;
  category: { name: string };
  price: number;
}

interface ExportToPdfProps {
  data: Product[];
}

const ExportToPdf: React.FC<ExportToPdfProps> = ({ data }) => {
  const exportToPdf = () => {
    if (!data) return;

    const products = data.map((product: Product, index: number) => ({
      N: index + 1,
      Producto: product.name,
      Categoría: product.category.name,
      Precio: product.price.toFixed(2),
    }));

    const total = products.reduce((acc: number, curr: { Precio: string }) => acc + parseFloat(curr.Precio), 0).toFixed(2);

    const productsWithTotal = [...products, { N: '', Producto: '', Categoría: 'Total:', Precio: total }];

    const doc = new jsPDF();

    // Agregar el logo del restaurante como encabezado en las esquinas
    const logoWidth = 20; // Tamaño reducido del logo
    const logoHeight = 20; // Tamaño reducido del logo
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoMargin = 6;
    
    // Logo en la esquina superior izquierda
    const logoLeft = logoMargin;
    const logoTop = logoMargin;
    const logo1 = new Image();
    logo1.src = '/logo-prototipo.png'; // Ruta relativa al archivo en la carpeta public
    doc.addImage(logo1, 'PNG', logoLeft, logoTop, logoWidth, logoHeight);

    // Logo en la esquina superior derecha
    const logo2 = new Image();
    logo2.src = '/logo-prototipo.png'; // Ruta relativa al archivo en la carpeta public
    const logo2Left = pageWidth - logoMargin - logoWidth;
    const logo2Top = logoMargin;
    doc.addImage(logo2, 'PNG', logo2Left, logo2Top, logoWidth, logoHeight);

    // Configurar estilos para el título
    doc.setFont('Arial', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Color negro
    doc.text('Listado de productos', doc.internal.pageSize.width / 2, 15, { align: 'center' });

    // Agregar el texto "Inventario de la inversión de los productos" sin negrita
  doc.setFontSize(11); // Tamaño de letra para el texto adicional
  doc.setFont('Arial', 'normal'); // Establecer la fuente normal
  doc.text('Inventario de la inversión de los productos', doc.internal.pageSize.width / 2, 22, { align: 'center' });


    // Configuración de estilos para la tabla
    const tableStyles = {
      startY: logoTop + logoHeight + logoMargin, // Iniciar después de los logos y el título
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid',
      tableWidth: 'auto', // Ajustar automáticamente el ancho de la tabla
    };

    // Usar jspdf-autotable para generar la tabla
    (doc as any).autoTable({
      head: [['N°', 'Producto', 'Categoría', 'Precio']],
      body: productsWithTotal.map((p, index) => {
        if (index === productsWithTotal.length - 1) {
          return [
            { content: p.N, styles: { cellWidth: 'wrap', fontStyle: 'bold', halign: 'center', fillColor: [173, 216, 230] } },
            { content: p.Producto, styles: { cellWidth: 'wrap', fontStyle: 'bold', halign: 'center', fillColor: [173, 216, 230] } },
            { content: p.Categoría, styles: { cellWidth: 'wrap', fontStyle: 'bold', halign: 'center', fillColor: [173, 216, 230] } },
            { content: p.Precio, styles: { cellWidth: 'wrap', fontStyle: 'bold', halign: 'center', fillColor: [173, 216, 230] } }
          ];
        }
        return [p.N, p.Producto, p.Categoría, p.Precio];
      }),
      ...tableStyles,
    });

    doc.save('Listado de productos.pdf');
  };

  return (
    <button
      onClick={exportToPdf}
      className="py-2 px-4 bg-blue-500 text-white rounded flex items-center hover:bg-red-500"
    >
       <FaFilePdf style={{ fontSize: '24px', color: 'red', marginRight: '8px' }} /> Exportar a PDF
    </button>
  );
};

export default ExportToPdf;
