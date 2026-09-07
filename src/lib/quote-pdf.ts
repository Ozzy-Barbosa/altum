import { jsPDF } from 'jspdf';
import { quoteTotals } from './business-domain.mjs';
type Quote = {
  number: number;
  title: string;
  customer: string;
  date: string;
  validUntil: string;
  notes: string;
  discount: number;
  lines: { description: string; quantity: number; price: number }[];
};
// The built-in PDF font supports Spanish Latin characters. No HTML or external assets are evaluated.
const printable = (text: string) =>
  String(text)
    .replace(/[\u0000-\u0008\u000b-\u001f]/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\xff\n]/gu, '?');
const currency = (value: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
export function createQuotePdf(quote: Quote) {
  const totals = quoteTotals(quote.lines, quote.discount);
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const reference = `COT-${String(quote.number).padStart(4, '0')}`;
  doc.setProperties({
    title: `Altum - ${reference} - Cotización de ejemplo`,
    author: 'Altum Soluciones Digitales',
  });
  let y = 0;
  const header = () => {
    doc.setFillColor('#10223c');
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.text('ALTUM', 18, 18);
    doc.setFontSize(8);
    doc.text('COTIZADOR DE DEMOSTRACIÓN', 18, 26);
    doc.setFont('helvetica', 'normal');
    doc.text(reference, 192, 19, { align: 'right' });
    y = 47;
    doc.setTextColor('#283c55');
  };
  const room = (height: number) => {
    if (y + height > 269) {
      doc.addPage();
      header();
    }
  };
  const paragraph = (text: string, size = 10, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(printable(text), 174) as string[];
    for (const line of lines) {
      room(size * 0.45 + 2);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      doc.text(line, 18, y);
      y += size * 0.45 + 1;
    }
    y += 4;
  };
  const tableHeader = () => {
    room(13);
    doc.setFillColor('#eaf0f8');
    doc.rect(18, y - 4, 174, 11, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('CONCEPTO', 21, y + 2);
    doc.text('CANT.', 118, y + 2, { align: 'right' });
    doc.text('PRECIO', 154, y + 2, { align: 'right' });
    doc.text('IMPORTE', 189, y + 2, { align: 'right' });
    y += 15;
  };
  header();
  paragraph('DOCUMENTO DE EJEMPLO. NO VÁLIDO COMO FACTURA.', 8, true);
  paragraph(quote.title, 20, true);
  paragraph(`Preparada para: ${quote.customer}`, 11);
  paragraph(`Emisión: ${quote.date}    |    Vigencia: ${quote.validUntil || 'Sin definir'}`, 9);
  tableHeader();
  for (const line of quote.lines) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const description = doc.splitTextToSize(printable(line.description), 79) as string[];
    const height = Math.max(12, description.length * 4.4 + 6);
    if (y + height > 267) {
      doc.addPage();
      header();
      tableHeader();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
    }
    doc.text(description, 21, y);
    doc.text(String(line.quantity), 118, y, { align: 'right' });
    doc.text(currency(line.price), 154, y, { align: 'right' });
    doc.text(currency(quoteTotals([line], 0).total), 189, y, { align: 'right' });
    y += height;
    doc.setDrawColor('#d9e3ee');
    doc.line(18, y - 4, 192, y - 4);
  }
  room(48);
  y += 7;
  for (const [label, value] of [
    ['Subtotal', totals.subtotal],
    [`Descuento (${quote.discount} %)`, -totals.discount || 0],
    ['Total sin impuestos', totals.total],
  ] as const) {
    doc.setFont('helvetica', label === 'Total sin impuestos' ? 'bold' : 'normal');
    doc.setFontSize(11);
    doc.text(label, 105, y);
    doc.text(currency(value), 189, y, { align: 'right' });
    y += 9;
  }
  y += 8;
  paragraph('Condiciones y notas', 10, true);
  paragraph(quote.notes || 'Sin condiciones adicionales de ejemplo.', 9);
  paragraph('Importes en MXN. Este documento no se envía a ningún cliente desde la demo.', 8);
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor('#d9e3ee');
    doc.line(18, 279, 192, 279);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor('#52677e');
    doc.text('www.altumlapaz.com  |  Cotización de ejemplo', 18, 286);
    doc.text(`${page} / ${pages}`, 192, 286, { align: 'right' });
  }
  return doc;
}
