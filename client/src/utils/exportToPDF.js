import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Company branding constants (single source of truth)
const COMPANY_NAME = 'John Cezar Waterfun Resort';
const COMPANY_CONTACT = '09171224128 | johncezar.waterfun@gmail.com';
const COMPANY_ADDRESS = 'Rotonda Phase 3 Valle Verde Brgy Langkaan 2, Dasmarinas, Cavite, Philippines';
const COMPANY_WEBSITE = 'https://www.john-cezar-waterfun-resort.com';
const LOGO_SRC = '/src/assets/images/logo/logo-circular.png';

// Load image as base64 (async) - works in browser with fetch
async function loadImageAsDataURL(src) {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error('Failed to load logo image for PDF:', e?.message || e);
    return null; // Continue without logo
  }
}

/**
 * Generic export to PDF utility with company branding.
 * @param {Object} options
 * @param {String} options.fileName - Name of the output file (with .pdf optional)
 * @param {String} options.title - Main document title
 * @param {String} [options.subtitle] - Subtitle below the title
 * @param {Array<{ heading: string, table?: { head: string[], rows: any[][] }, keyValues?: Array<[string,string]> }>} options.sections - Structured content sections
 * @param {String} [options.footerNote] - Optional note appended above global footer
 * @param {String} [options.orientation='p'] - 'p' portrait or 'l' landscape
 * @param {Boolean} [options.includeLogo=true] - Whether to embed the company logo
 * @param {Boolean} [options.includeBrandFooter=true] - Whether to show the standard brand footer
 * @param {Object} [options.preparedBy] - User object with firstName and lastName for "Prepared by" field
 */
export async function exportToPDF({
  fileName = 'report.pdf',
  title = 'Report',
  subtitle,
  sections = [],
  footerNote,
  orientation = 'p',
  includeLogo = true,
  includeBrandFooter = true,
  preparedBy = null,
}) {
  const doc = new jsPDF(orientation, 'pt');

  // Attempt to load logo if requested
  let logoDataURL = null;
  if (includeLogo) {
    logoDataURL = await loadImageAsDataURL(LOGO_SRC);
  }

  let cursorY = 40; // initial Y coordinate

  // Header with logo and company name
  if (logoDataURL) {
    try {
      // Add logo (keep within header area)
      doc.addImage(logoDataURL, 'PNG', 40, 25, 70, 70, undefined, 'FAST');
    } catch (e) {
      console.warn('Logo addImage failed:', e?.message || e);
    }
  }

  // Company header - properly aligned
  const headerStartX = logoDataURL ? 120 : 40;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(COMPANY_NAME, headerStartX, 45);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(COMPANY_ADDRESS, headerStartX, 60);
  doc.text(COMPANY_CONTACT, headerStartX, 72);
  if (COMPANY_WEBSITE) doc.text(COMPANY_WEBSITE, headerStartX, 84);

  cursorY = logoDataURL ? 110 : 90;

  // Document title area with better spacing
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 40, cursorY);
  cursorY += 20;

  if (subtitle) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    doc.text(subtitle, 40, cursorY);
    doc.setTextColor(0, 0, 0);
    cursorY += 18;
  }

  // Generated info with proper spacing
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated On: ${new Date().toLocaleString()}`, 40, cursorY);
  cursorY += 12;

  // Add "Prepared by" if user info is provided
  if (preparedBy && (preparedBy.firstName || preparedBy.lastName)) {
    const preparedByName = `${preparedBy.firstName || ''} ${preparedBy.lastName || ''}`.trim();
    doc.text(`Prepared by: ${preparedByName}`, 40, cursorY);
    cursorY += 12;
  }

  // Draw divider line with better spacing
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(40, cursorY, doc.internal.pageSize.getWidth() - 40, cursorY);
  cursorY += 20;

  // Helper: Add a key-value table like earlier reservation summary
  const addKeyValueTable = (heading, pairs) => {
    const startY = cursorY;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(heading, 40, startY);
    cursorY += 12;
    autoTable(doc, {
      startY: cursorY,
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [63, 81, 181], textColor: 255, fontStyle: 'bold' },
      head: [['Field', 'Value']],
      body: pairs.map(([k, v]) => [k, v]),
      margin: { left: 40, right: 40 },
      theme: 'striped',
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    cursorY = doc.lastAutoTable.finalY + 25;
  };

  // Helper: Add a generic table section
  const addGenericTable = (heading, head, rows) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(heading, 40, cursorY);
    cursorY += 12;
    autoTable(doc, {
      startY: cursorY,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [33, 150, 243], textColor: 255, fontStyle: 'bold' },
      head: [head],
      body: rows,
      margin: { left: 40, right: 40 },
      theme: 'striped',
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    cursorY = doc.lastAutoTable.finalY + 25;
  };

  // Process sections
  for (const section of sections) {
    if (section.keyValues?.length) {
      addKeyValueTable(section.heading, section.keyValues);
    }
    if (section.table?.head && section.table?.rows) {
      addGenericTable(section.heading, section.table.head, section.table.rows);
    }
  }

  // Footer note
  if (footerNote) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.text(footerNote, 40, pageHeight - (includeBrandFooter ? 40 : 20));
  }

  // Brand footer
  if (includeBrandFooter) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.text(`Thank you for choosing ${COMPANY_NAME}! For inquiries: ${COMPANY_CONTACT}`, 40, pageHeight - 20);
  }

  // Normalize filename
  const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  doc.save(safeFileName);
}

export default exportToPDF;
