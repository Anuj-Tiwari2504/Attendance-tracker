
import { AttendanceRecord } from '../types';

declare global {
  interface Window {
    jspdf: any;
  }
}

const generatePdf = (title: string, head: string[][], body: (string | number)[][]) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    (doc as any).autoTable({
        head: head,
        body: body,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [22, 160, 133] },
        styles: { fontSize: 10 },
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_report.pdf`);
};

export const exportFullReport = (records: AttendanceRecord[]) => {
    const body = records.map(r => [r.name, r.date]);
    generatePdf('Full Attendance Report', [['Name', 'Date']], body);
};

export const exportMonthlyReport = (month: string, data: { name: string; count: number }[]) => {
    const body = data.map(d => [d.name, d.count]);
    generatePdf(`Attendance Report - ${month}`, [['Name', 'Attendance Count']], body);
};

export const exportMemberReport = (name: string, records: AttendanceRecord[]) => {
    const body = records.map(r => [r.date]);
    generatePdf(`Attendance Report for ${name}`, [['Date']], body);
};
