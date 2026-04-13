import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Patient, Appointment } from '../types';

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

export const exportConsultationToPDF = (patient: Patient, appointment: Appointment, formData: any) => {
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
  doc.text('Dr. Walter Antonio Guidos', 140, 15);
  doc.text('Director Médico', 140, 20);
  doc.text('Calle Médica #123, San Salvador', 140, 25);
  doc.text('Tel: 2222-0000 | clinicaguidos.com', 140, 30);
  
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
  doc.line(70, 260, 140, 260);
  doc.setFontSize(10);
  doc.text('Dr. Walter Antonio Guidos', 105, 265, { align: 'center' });
  doc.text('Sello y Firma', 105, 270, { align: 'center' });
  
  doc.save(`ClinicaGuidos_${appointment.specialty}_${patient.lastName}.pdf`);
};
