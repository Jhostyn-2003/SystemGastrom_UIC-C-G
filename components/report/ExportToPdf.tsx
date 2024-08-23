"use client";

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaFilePdf } from 'react-icons/fa';
import React from "react";

// Definición de tipos para los productos
interface Product {
  name: string;
  category: { name: string };
  price: number;
  stock: number | null; // Nuevo campo para el stock
}

// Propiedades del componente ExportToPdf
interface ExportToPdfProps {
  data: Product[];
}

// Componente principal ExportToPdf
const ExportToPdf: React.FC<ExportToPdfProps> = ({ data }) => {
  const exportToPdf = () => {
    if (!data) return;

    const products = data.map((product: Product, index: number) => {
      const stockValue = product.stock !== null ? product.stock : 'N/a';
      const totalValue = product.stock !== null ? (product.price * product.stock).toFixed(2) : product.price.toFixed(2);
      return {
        N: index + 1,
        Producto: product.name,
        Categoria: product.category.name,
        Stock: stockValue.toString(),
        Precio: product.price.toFixed(2),
        Total: totalValue
      };
    });

    const doc = new jsPDF();

    // Agregar el logo del restaurante como encabezado en las esquinas
    const logoWidth = 20;
    const logoHeight = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoMargin = 6;

    const logoLeft = logoMargin;
    const logoTop = logoMargin;
    const logo1 = new Image();
    logo1.src = '/logo-prototipo.png';
    doc.addImage(logo1, 'PNG', logoLeft, logoTop, logoWidth, logoHeight);

    const logo2 = new Image();
    logo2.src = '/logo-prototipo.png';
    const logo2Left = pageWidth - logoMargin - logoWidth;
    doc.addImage(logo2, 'PNG', logo2Left, logoMargin, logoWidth, logoHeight);

    // Configurar estilos para el título
    doc.setFont('Arial', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Color negro
    doc.text('Listado de productos', doc.internal.pageSize.width / 2, 15, { align: 'center' });

    // Agregar el texto "Detalles de Inversión y Stock de Productos" sin negrita
    doc.setFontSize(11);
    doc.setFont('Arial', 'normal');
    doc.text('Detalles de Inversión y Stock de Productos', doc.internal.pageSize.width / 2, 22, { align: 'center' });

    // Obtener la fecha y hora actuales
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString();

    // Agregar la fecha y hora al PDF, justo debajo del texto anterior
    doc.setFontSize(10);
    doc.text(`Fecha y hora de descarga: ${dateString} ${timeString}`, doc.internal.pageSize.width / 2, 27, { align: 'center' });

    // Configuración de estilos para la tabla
    const tableStyles = {
      startY: 32, // Posiciona la tabla más cerca de la fecha y hora
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid',
      tableWidth: 'auto',
    };

    // Usar jspdf-autotable para generar la tabla
    (doc as any).autoTable({
      head: [['N°', 'Producto', 'Categoria', 'Stock', 'Precio', 'Total']],
      body: products.map((p) => [p.N, p.Producto, p.Categoria, p.Stock, p.Precio, p.Total]),
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
