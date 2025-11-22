import autoTable from 'jspdf-autotable';
import { exportToPDF } from './exportToPDF';

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
export async function exportReservationToPdf(reservation, message) {
  if (!reservation) return;

  const customerFullName = `${fmt(reservation?.userData?.firstName)} ${fmt(reservation?.userData?.lastName)}`.trim();
  const paymentStatus = (reservation?.amount?.totalPaid || 0) >= (reservation?.amount?.total || 0)
    ? 'Fully Paid' : ((reservation?.amount?.totalPaid || 0) > 0 ? 'Partially Paid' : 'Unpaid');

  await exportToPDF({
    fileName: `reservation-${fmt(reservation?.reservationId)}.pdf`,
    title: 'Reservation Summary',
    subtitle: message,
    sections: [
      {
        heading: 'Reservation Details',
        keyValues: [
          ['Reservation ID', `#${fmt(reservation?.reservationId)}`],
          ['Status', fmt(reservation?.status)?.toUpperCase()],
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
      }
    ]
  });
}

export default exportReservationToPdf;
