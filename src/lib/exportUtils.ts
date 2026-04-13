import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Patient, Appointment, Prescription } from '../types';

// Extend jsPDF with autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToExcel = (data: any[], fileName: string, specialty?: string) => {
  // Filter fields based on specialty if provided
  let filteredData = data.map(item => {
    const filtered: any = {
      ID: item.id,
      Paciente: `${item.firstName} ${item.lastName}`,
      Género: item.gender,
      Edad: new Date().getFullYear() - new Date(item.dob).getFullYear(),
      Contacto: item.contact,
    };

    if (specialty === 'Nutrición') {
      const lastRecord = item.history?.filter((h: any) => h.specialty === 'Nutrición').pop();
      filtered.Peso = lastRecord?.weight || 'N/A';
      filtered.IMC = lastRecord?.data?.imc || 'N/A';
      filtered.Grasa = lastRecord?.data?.fatPercentage || 'N/A';
      filtered.Músculo = lastRecord?.data?.muscleMass || 'N/A';
    } else if (specialty === 'Psicología') {
      const lastRecord = item.history?.filter((h: any) => h.specialty === 'Psicología').pop();
      filtered.Ansiedad = lastRecord?.data?.anxietyScore || 'N/A';
      filtered.Depresión = lastRecord?.data?.depressionScore || 'N/A';
      filtered.Notas = lastRecord?.data?.evolutionNotes || 'N/A';
    } else if (specialty === 'Ginecología') {
      const lastRecord = item.history?.filter((h: any) => h.specialty === 'Ginecología').pop();
      filtered.Gesta = lastRecord?.data?.gesta || 'N/A';
      filtered.Para = lastRecord?.data?.para || 'N/A';
      filtered.FUM = lastRecord?.data?.fum || 'N/A';
      filtered.FPP = lastRecord?.data?.fpp || 'N/A';
    } else if (specialty === 'Ortopedia' || specialty === 'Fisioterapia') {
      const lastRecord = item.history?.filter((h: any) => h.specialty === specialty).pop();
      filtered.Dolor_EVA = lastRecord?.data?.painLevel || 'N/A';
      filtered.Zonas = lastRecord?.data?.treatedZones?.join(', ') || 'N/A';
      filtered.Sesión = lastRecord?.data?.sessionNumber || 'N/A';
    } else if (specialty === 'Cirugía General') {
      const lastRecord = item.history?.filter((h: any) => h.specialty === 'Cirugía General').pop();
      filtered.Diagnóstico = lastRecord?.diagnosis || 'N/A';
      filtered.Estatus_Cirugía = lastRecord?.data?.surgeryStatus || 'N/A';
      filtered.Fecha_Cirugía = lastRecord?.data?.surgeryDate || 'N/A';
    }

    return filtered;
  });

  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportConsultationToPDF = (patient: Patient, appointment: Appointment, formData: any, doctor?: any) => {
  const doc = new jsPDF();
  
  // Professional Header
  doc.setFillColor(0, 73, 144); // Primary Blue
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('CLÍNICA GUIDOS', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dr. ${doctor?.firstName || 'Walter'} ${doctor?.lastName || 'Guidos'}`, 140, 15);
  doc.text(doctor?.specialty || 'Director Médico', 140, 20);
  doc.text(doctor?.university || 'Calle Médica #123, San Salvador', 140, 25);
  doc.text(`JVPM: ${doctor?.licenseNumber || '2222-0000'}`, 140, 30);
  
  // Specialty Banner
  const specialtyColor = {
    'Nutrición': [0, 209, 178], // Secondary Teal
    'Psicología': [147, 51, 234],
    'Ginecología': [236, 72, 153],
    'Ortopedia': [249, 115, 22],
    'Fisioterapia': [6, 182, 212],
    'Cirugía General': [37, 99, 235]
  }[appointment.specialty] || [0, 73, 144];

  doc.setFillColor(specialtyColor[0], specialtyColor[1], specialtyColor[2]);
  doc.rect(0, 40, 210, 10, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(`REPORTE CLÍNICO: ${appointment.specialty.toUpperCase()}`, 105, 47, { align: 'center' });
  
  // Patient Info
  doc.setTextColor(0, 73, 144);
  doc.setFontSize(14);
  doc.text('INFORMACIÓN DEL PACIENTE', 20, 65);
  
  doc.setDrawColor(0, 73, 144);
  doc.setLineWidth(0.5);
  doc.line(20, 67, 190, 67);
  
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.setFont('helvetica', 'normal');
  
  const patientData = [
    ['Nombre:', `${patient.firstName} ${patient.lastName}`, 'Expediente:', `#2024-${patient.id.slice(-4)}`],
    ['Edad:', `${new Date().getFullYear() - new Date(patient.dob).getFullYear()} años`, 'Fecha:', new Date().toLocaleDateString()],
    ['Género:', patient.gender, 'Contacto:', patient.contact]
  ];

  doc.autoTable({
    startY: 70,
    body: patientData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: 'bold', width: 30 }, 2: { fontStyle: 'bold', width: 30 } }
  });
  
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Clinical Findings
  doc.setTextColor(0, 73, 144);
  doc.setFontSize(14);
  doc.text('HALLAZGOS CLÍNICOS', 20, finalY);
  
  doc.line(20, finalY + 2, 190, finalY + 2);
  
  const specialtyEntries = Object.entries(formData).filter(([key]) => key !== 'diagnosis' && key !== 'treatmentPlan');
  
  doc.autoTable({
    startY: finalY + 5,
    body: specialtyEntries,
    theme: 'striped',
    headStyles: { fill: specialtyColor, textColor: 255 },
    styles: { fontSize: 10 },
    columnStyles: { 0: { fontStyle: 'bold', width: 50 } }
  });
  
  const finalY2 = (doc as any).lastAutoTable.finalY + 10;
  
  // Diagnosis
  doc.setTextColor(0, 73, 144);
  doc.setFontSize(14);
  doc.text('DIAGNÓSTICO Y TRATAMIENTO', 20, finalY2);
  doc.line(20, finalY2 + 2, 190, finalY2 + 2);
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Diagnóstico:', 20, finalY2 + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.diagnosis || 'No especificado', 50, finalY2 + 10, { maxWidth: 140 });
  
  doc.setFont('helvetica', 'bold');
  doc.text('Plan de Tratamiento:', 20, finalY2 + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(formData.treatmentPlan || 'Seguimiento en próxima consulta', 20, finalY2 + 28, { maxWidth: 170 });
  
  // Signature
  if (doctor?.signatureUrl) {
    doc.addImage(doctor.signatureUrl, 'PNG', 85, 235, 40, 20);
  }
  doc.line(70, 260, 140, 260);
  doc.setFontSize(10);
  doc.text(`Dr. ${doctor?.firstName || 'Walter'} ${doctor?.lastName || 'Guidos'}`, 105, 265, { align: 'center' });
  doc.text('Sello y Firma', 105, 270, { align: 'center' });
  
  doc.save(`ClinicaGuidos_${appointment.specialty}_${patient.lastName}.pdf`);
};

export const exportPrescriptionToPDF = async (patient: Patient, prescription: Prescription, doctor?: any) => {
  const doc = new jsPDF();
  
  // Professional Header / Letterhead
  doc.setFillColor(0, 73, 144); // Primary Blue
  doc.rect(0, 0, 210, 45, 'F');
  
  // Logo Placeholder (Circle)
  doc.setFillColor(255, 255, 255, 0.2);
  doc.circle(35, 22, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('G', 32, 25);

  doc.setFontSize(24);
  doc.text('CLÍNICA GUIDOS', 55, 22);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Excelencia Médica y Cuidado Integral', 55, 28);
  doc.text('Calle Médica #123, San Salvador, El Salvador', 55, 33);
  doc.text('Tel: +503 2222-0000 | info@clinicaguidos.com', 55, 38);

  // Doctor Info (Right Aligned)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Dr. ${doctor?.firstName || 'Walter'} ${doctor?.lastName || 'Guidos'}`, 140, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(doctor?.specialty || 'Director Médico', 140, 20);
  doc.text(`Cédula Prof: ${doctor?.licenseNumber || 'JVPM 2222-0000'}`, 140, 25);
  doc.text(doctor?.university || 'Universidad de El Salvador', 140, 30);
  
  // Prescription Banner
  doc.setFillColor(0, 209, 178); // Secondary Teal
  doc.rect(0, 45, 210, 10, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('RECETA MÉDICA / PRESCRIPCIÓN', 105, 52, { align: 'center' });
  
  // Patient Info Section
  doc.setTextColor(0, 73, 144);
  doc.setFontSize(14);
  doc.text('DATOS DEL PACIENTE', 20, 70);
  
  doc.setDrawColor(0, 73, 144);
  doc.setLineWidth(0.5);
  doc.line(20, 72, 190, 72);
  
  doc.setFontSize(10);
  doc.setTextColor(50);
  doc.setFont('helvetica', 'normal');
  
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
  
  doc.text(`Nombre: ${patient.firstName} ${patient.lastName}`, 20, 80);
  doc.text(`Edad: ${age} años`, 20, 87);
  doc.text(`Género: ${patient.gender}`, 20, 94);
  
  doc.text(`Fecha: ${new Date(prescription.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}`, 130, 80);
  doc.text(`Especialidad: ${prescription.specialty}`, 130, 87);
  doc.text(`ID Paciente: #2024-${patient.id.slice(-4)}`, 130, 94);

  // Rx Symbol
  doc.setFontSize(40);
  doc.setTextColor(0, 73, 144);
  doc.setFont('helvetica', 'bold');
  doc.text('Rx', 20, 115);

  // Prescription Items Table
  const tableData = prescription.items.map(item => [
    { content: `${item.medication}\n${item.dosage}`, styles: { fontStyle: 'bold' } },
    item.frequency,
    item.duration,
    item.instructions || '-'
  ]);

  doc.autoTable({
    startY: 125,
    head: [['Medicamento / Dosis', 'Frecuencia', 'Duración', 'Indicaciones']],
    body: tableData,
    theme: 'striped',
    headStyles: { fill: [0, 73, 144], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 6, valign: 'middle' },
    columnStyles: { 
      0: { width: 60 },
      1: { width: 35 },
      2: { width: 30 },
      3: { width: 45 }
    }
  });

  // Footer / Signature Area
  const finalY = (doc as any).lastAutoTable.finalY + 40;
  
  // Check for signature
  if (doctor?.signatureUrl) {
    try {
      doc.addImage(doctor.signatureUrl, 'PNG', 85, finalY - 35, 40, 20);
    } catch (e) {
      console.error('Error adding signature to PDF:', e);
    }
  }
  
  doc.setDrawColor(200);
  doc.line(70, finalY, 140, finalY);
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text(`Dr. ${doctor?.firstName || 'Walter'} ${doctor?.lastName || 'Guidos'}`, 105, finalY + 7, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(doctor?.specialty || 'Médico Especialista', 105, finalY + 12, { align: 'center' });
  doc.text(`JVPM: ${doctor?.licenseNumber || '2222-0000'}`, 105, finalY + 16, { align: 'center' });
  doc.text('Sello y Firma Autorizada', 105, finalY + 22, { align: 'center' });

  // Bottom Disclaimer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('Esta receta tiene una validez de 30 días a partir de su fecha de emisión.', 105, 285, { align: 'center' });
  doc.text('Clínica Guidos - Sistema de Gestión Médica Digital', 105, 290, { align: 'center' });

  const dateStr = new Date().toLocaleDateString('es-ES').replace(/\//g, '-');
  const fileName = `Receta_${patient.firstName}_${patient.lastName}_${dateStr}.pdf`;
  doc.save(fileName);
  return doc;
};

export const sharePrescription = async (patient: Patient, prescription: Prescription) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Receta Médica - ${patient.firstName} ${patient.lastName}`,
        text: `Hola ${patient.firstName}, adjunto tu receta médica de la Clínica Guidos.`,
        url: window.location.href, // In a real app, this would be a link to the PDF
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    // Fallback for desktop: open WhatsApp with message
    const message = `Hola ${patient.firstName}, te envío tu receta médica de Clínica Guidos.`;
    window.open(`https://wa.me/${patient.contact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  }
};
