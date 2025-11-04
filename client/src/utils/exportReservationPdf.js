import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const peso = (value) => {
  const num = Number(value || 0);
  try {
    const formatted = new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
    return `PHP ${formatted}`;
  } catch (e) {
    const fixed = (isFinite(num) ? num : 0).toFixed(2);
    return `PHP ${fixed}`;
  }
};

const fmt = (v) => (v === undefined || v === null || v === '' ? '-' : String(v));

const formatDateTime = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return fmt(value);
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
};

/**
 * Generate and download a reservation summary PDF.
 * @param {object} reservation - Reservation object from API/list
 * @param {string} [message] - Optional message to display in the PDF (e.g., for verification)
 */
export function exportReservationToPdf(reservation, message) {
  if (!reservation) return;

  const doc = new jsPDF();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Reservation Summary', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Reservation ID: #${fmt(reservation?.reservationId)}`, 14, 26);
  if (reservation?.status) {
    doc.text(`Status: ${String(reservation.status).toUpperCase()}`, 14, 32);
  }

  if (message) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(40, 120, 40);
    doc.text(message, 14, 40);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  }

  const customerFullName = `${fmt(reservation?.userData?.firstName)} ${fmt(reservation?.userData?.lastName)}`.trim();
  const paymentStatus = (reservation?.amount?.totalPaid || 0) >= (reservation?.amount?.total || 0)
    ? 'Fully Paid' : ((reservation?.amount?.totalPaid || 0) > 0 ? 'Partially Paid' : 'Unpaid');

  autoTable(doc, {
    startY: message ? 48 : 38,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [63, 81, 181] },
    head: [['Field', 'Value']],
    body: [
      ['Customer Name', customerFullName || '-'],
      ['Customer Email', fmt(reservation?.userData?.emailAddress)],
      ['Accommodation', fmt(reservation?.accommodationData?.name)],
      ['Guests', fmt(reservation?.guests)],
      ['Start Date', formatDateTime(reservation?.startDate)],
      ['End Date', formatDateTime(reservation?.endDate)],
      ['Reschedule', fmt(reservation?.rescheduleRequest?.status || 'None')],
      ['Payment Status', paymentStatus],
      ['Accommodation Total', peso(reservation?.amount?.accommodationTotal)],
      ['Entrance Total', peso(reservation?.amount?.entranceTotal)],
      ['Minimum Payable', peso(reservation?.amount?.minimumPayable)],
      ['Grand Total', peso(reservation?.amount?.total)],
      ['Total Paid', peso(reservation?.amount?.totalPaid)],
      ['Balance', peso((reservation?.amount?.total || 0) - (reservation?.amount?.totalPaid || 0))],
      ['Created At', formatDateTime(reservation?.createdAt)]
    ]
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(9);
  doc.text(
    'Thank you for choosing John Cezar Waterfun Resort! For inquiries, contact us at 09171224128 or johncezar.waterfun@gmail.com',
    14,
    pageHeight - 10
  );

  const fileName = `reservation-${fmt(reservation?.reservationId)}.pdf`;
  doc.save(fileName);
}

export default exportReservationToPdf;
