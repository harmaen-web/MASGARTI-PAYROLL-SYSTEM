import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function buildFilename(employeeId, month) {
  const safeId = (employeeId || 'employee').replace(/[^\w-]+/g, '_');
  const safeMonth = (month || 'payslip').replace(/[^\w-]+/g, '_');
  return `Payslip_${safeId}_${safeMonth}.pdf`;
}

async function prepareImages(element) {
  const images = [...element.querySelectorAll('img')];
  const restores = [];

  await Promise.all(
    images.map(async (img) => {
      const originalSrc = img.currentSrc || img.src;
      try {
        const response = await fetch(originalSrc);
        const blob = await response.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        img.src = dataUrl;
        restores.push(() => {
          img.src = originalSrc;
        });
      } catch {
        await new Promise((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
    }),
  );

  return () => restores.forEach((restore) => restore());
}

export async function downloadPayslipPdf(element, { employeeId, month }) {
  if (!element) throw new Error('Payslip content not found');

  element.scrollIntoView({ block: 'start' });
  const restoreImages = await prepareImages(element);

  const isDark = document.documentElement.classList.contains('dark');
  const backgroundColor = window.getComputedStyle(element).backgroundColor;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor,
      scrollX: 0,
      scrollY: -window.scrollY,
      onclone: (clonedDoc, clonedElement) => {
        if (isDark) {
          clonedDoc.documentElement.classList.add('dark');
        }
        clonedElement.style.overflow = 'visible';
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.width = `${element.offsetWidth}px`;
        clonedElement.style.maxWidth = 'none';
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    let renderWidth = maxWidth;
    let renderHeight = (canvas.height * renderWidth) / canvas.width;

    if (renderHeight > maxHeight) {
      renderHeight = maxHeight;
      renderWidth = (canvas.width * renderHeight) / canvas.height;
    }

    const x = (pageWidth - renderWidth) / 2;
    const y = margin;

    pdf.addImage(imgData, 'JPEG', x, y, renderWidth, renderHeight);
    pdf.save(buildFilename(employeeId, month));
  } finally {
    restoreImages();
  }
}
