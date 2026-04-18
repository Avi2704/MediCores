'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface Props {
  targetId: string;
  fileName?: string;
  label?: string;
}

export default function ExportButton({ targetId, fileName = 'health-report.pdf', label = 'Export PDF' }: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);

      const element = document.getElementById(targetId);
      if (!element) {
        alert('Could not find content to export.');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let yOffset = 10;

      if (imgHeight <= pageHeight - 20) {
        pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
      } else {
        let remainingHeight = imgHeight;
        let sourceY = 0;
        while (remainingHeight > 0) {
          const sliceHeight = Math.min(pageHeight - 20, remainingHeight);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = (sliceHeight * canvas.width) / imgWidth;
          const ctx = sliceCanvas.getContext('2d')!;
          ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);
          pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 10, yOffset, imgWidth, sliceHeight);
          remainingHeight -= sliceHeight;
          sourceY += sliceCanvas.height;
          if (remainingHeight > 0) {
            pdf.addPage();
            yOffset = 10;
          }
        }
      }

      pdf.save(fileName);
    } catch (err) {
      console.error('Export failed:', err);
      alert('PDF export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {exporting ? 'Exporting…' : label}
    </button>
  );
}
