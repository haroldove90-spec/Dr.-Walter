import { Patient, Appointment, Specialty } from '../types';

export const MOCK_PATIENTS: Patient[] = [
  // Nutrición (5+)
  {
    id: 'n1',
    firstName: 'Ana',
    lastName: 'García',
    gender: 'Femenino',
    dob: '1992-05-15',
    contact: '7788-1122',
    email: 'ana.garcia@email.com',
    history: [
      { id: 'h1', date: '2024-01-10', specialty: 'Nutrición', weight: 85, height: 1.65, diagnosis: 'Obesidad Grado I', data: { imc: 31.2, fatPercentage: 35, muscleMass: 28 }, prescriptions: [{
        id: 'rx-1', patientId: 'n1', doctorId: '1', date: '2024-01-10', specialty: 'Nutrición', items: [{ medication: 'Dieta Hipocalórica 1500 kcal', dosage: 'Según plan adjunto', frequency: 'Diario', duration: '30 días', instructions: 'Evitar azúcares refinados y harinas blancas.' }]
      }] },
      { id: 'h2', date: '2024-02-10', specialty: 'Nutrición', weight: 82, height: 1.65, diagnosis: 'Mejoría progresiva', data: { imc: 30.1, fatPercentage: 33, muscleMass: 28.5 } },
      { id: 'h3', date: '2024-03-10', specialty: 'Nutrición', weight: 79, height: 1.65, diagnosis: 'Sobrepeso', data: { imc: 29.0, fatPercentage: 31, muscleMass: 29 } },
    ]
  },
  {
    id: 'n2',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    gender: 'Masculino',
    dob: '1985-11-20',
    contact: '7788-3344',
    email: 'carlos.mendoza@email.com',
    history: [
      { id: 'h4', date: '2024-01-15', specialty: 'Nutrición', weight: 95, height: 1.80, diagnosis: 'Sobrepeso', data: { imc: 29.3, fatPercentage: 28, muscleMass: 35 } },
      { id: 'h5', date: '2024-02-15', specialty: 'Nutrición', weight: 92, height: 1.80, diagnosis: 'Mejoría', data: { imc: 28.4, fatPercentage: 26, muscleMass: 36 } },
    ]
  },
  { id: 'n3', firstName: 'Elena', lastName: 'Rodríguez', gender: 'Femenino', dob: '1995-03-12', contact: '7788-5566', email: 'elena.rod@email.com', history: [{ id: 'h6', date: '2024-03-01', specialty: 'Nutrición', weight: 65, height: 1.60, diagnosis: 'Normopeso', data: { imc: 25.4, fatPercentage: 24, muscleMass: 22 } }] },
  { id: 'n4', firstName: 'Roberto', lastName: 'Sosa', gender: 'Masculino', dob: '1978-07-08', contact: '7788-7788', email: 'roberto.sosa@email.com', history: [{ id: 'h7', date: '2024-02-20', specialty: 'Nutrición', weight: 110, height: 1.75, diagnosis: 'Obesidad Grado II', data: { imc: 35.9, fatPercentage: 38, muscleMass: 32 } }] },
  { id: 'n5', firstName: 'Lucía', lastName: 'Méndez', gender: 'Femenino', dob: '1990-12-01', contact: '7788-9900', email: 'lucia.mendez@email.com', history: [{ id: 'h8', date: '2024-03-05', specialty: 'Nutrición', weight: 72, height: 1.68, diagnosis: 'Sobrepeso leve', data: { imc: 25.5, fatPercentage: 28, muscleMass: 24 } }] },

  // Psicología (5+)
  {
    id: 'p1',
    firstName: 'Mario',
    lastName: 'López',
    gender: 'Masculino',
    dob: '1988-04-10',
    contact: '7711-2233',
    email: 'mario.lopez@email.com',
    history: [
      { id: 'h9', date: '2024-03-01', specialty: 'Psicología', diagnosis: 'Ansiedad Generalizada', data: { evolutionNotes: 'Paciente presenta mejoría en el manejo de ataques de pánico.', anxietyScore: 12, depressionScore: 8 } },
      { id: 'h10', date: '2024-03-15', specialty: 'Psicología', diagnosis: 'Seguimiento', data: { evolutionNotes: 'Se aplican técnicas de respiración diafragmática con éxito.', anxietyScore: 10, depressionScore: 7 } },
    ]
  },
  { id: 'p2', firstName: 'Sofía', lastName: 'Castro', gender: 'Femenino', dob: '1993-08-25', contact: '7711-4455', email: 'sofia.castro@email.com', history: [{ id: 'h11', date: '2024-03-10', specialty: 'Psicología', diagnosis: 'Depresión Leve', data: { evolutionNotes: 'Inicia proceso terapéutico cognitivo-conductual.', anxietyScore: 8, depressionScore: 14 } }] },
  { id: 'p3', firstName: 'Luis', lastName: 'Rivas', gender: 'Masculino', dob: '1982-01-15', contact: '7711-6677', email: 'luis.rivas@email.com', history: [{ id: 'h12', date: '2024-03-12', specialty: 'Psicología', diagnosis: 'Estrés Laboral', data: { evolutionNotes: 'Paciente refiere agotamiento extremo.', anxietyScore: 15, depressionScore: 5 } }] },
  { id: 'p4', firstName: 'Carmen', lastName: 'Vega', gender: 'Femenino', dob: '1998-11-30', contact: '7711-8899', email: 'carmen.vega@email.com', history: [{ id: 'h13', date: '2024-03-14', specialty: 'Psicología', diagnosis: 'Duelo', data: { evolutionNotes: 'Etapa de aceptación progresiva.', anxietyScore: 9, depressionScore: 11 } }] },
  { id: 'p5', firstName: 'Jorge', lastName: 'Díaz', gender: 'Masculino', dob: '1975-06-20', contact: '7711-0011', email: 'jorge.diaz@email.com', history: [{ id: 'h14', date: '2024-03-16', specialty: 'Psicología', diagnosis: 'Trastorno del Sueño', data: { evolutionNotes: 'Mejoría en higiene del sueño.', anxietyScore: 11, depressionScore: 6 } }] },

  // Ginecología (5+)
  {
    id: 'g1',
    firstName: 'Beatriz',
    lastName: 'Luna',
    gender: 'Femenino',
    dob: '1994-02-14',
    contact: '7722-1122',
    email: 'beatriz.luna@email.com',
    history: [
      { id: 'h15', date: '2024-02-01', specialty: 'Ginecología', diagnosis: 'Embarazo 12 semanas', data: { gesta: 1, para: 0, fum: '2023-11-05', fpp: '2024-08-12', ultrasoundNotes: 'Feto único vivo, latido rítmico.' } },
    ]
  },
  { id: 'g2', firstName: 'Patricia', lastName: 'Sol', gender: 'Femenino', dob: '1989-09-10', contact: '7722-3344', email: 'patricia.sol@email.com', history: [{ id: 'h16', date: '2024-03-05', specialty: 'Ginecología', diagnosis: 'Control Prenatal', data: { gesta: 2, para: 1, fum: '2023-12-10', fpp: '2024-09-17', ultrasoundNotes: 'Crecimiento acorde a edad gestacional.' } }] },
  { id: 'g3', firstName: 'Rosa', lastName: 'Pérez', gender: 'Femenino', dob: '1982-05-20', contact: '7722-5566', email: 'rosa.perez@email.com', history: [{ id: 'h17', date: '2024-03-08', specialty: 'Ginecología', diagnosis: 'SOP', data: { gesta: 0, para: 0, ultrasoundNotes: 'Ovarios con múltiples folículos periféricos.' } }] },
  { id: 'g4', firstName: 'Marta', lastName: 'Gómez', gender: 'Femenino', dob: '1991-07-15', contact: '7722-7788', email: 'marta.gomez@email.com', history: [{ id: 'h18', date: '2024-03-12', specialty: 'Ginecología', diagnosis: 'Embarazo 32 semanas', data: { gesta: 3, para: 2, fum: '2023-08-01', fpp: '2024-05-08', ultrasoundNotes: 'Presentación cefálica.' } }] },
  { id: 'g5', firstName: 'Julia', lastName: 'Torres', gender: 'Femenino', dob: '1987-10-05', contact: '7722-9900', email: 'julia.torres@email.com', history: [{ id: 'h19', date: '2024-03-15', specialty: 'Ginecología', diagnosis: 'Control Anual', data: { gesta: 1, para: 1, ultrasoundNotes: 'Útero y anexos normales.' } }] },

  // Ortopedia / Fisioterapia (5+)
  {
    id: 'o1',
    firstName: 'Ricardo',
    lastName: 'Valle',
    gender: 'Masculino',
    dob: '1980-03-22',
    contact: '7733-1122',
    email: 'ricardo.valle@email.com',
    history: [
      { id: 'h20', date: '2024-03-01', specialty: 'Ortopedia', diagnosis: 'Lumbalgia Mecánica', data: { painLevel: 8, treatedZones: ['espalda baja'], sessionNumber: 1 }, prescriptions: [{
        id: 'rx-2', patientId: 'o1', doctorId: '1', date: '2024-03-01', specialty: 'Ortopedia', items: [{ medication: 'Diclofenaco 75mg', dosage: '1 ampolla IM', frequency: 'Cada 24 horas', duration: '3 días', instructions: 'Aplicar vía intramuscular profunda.' }]
      }] },
      { id: 'h21', date: '2024-03-08', specialty: 'Fisioterapia', diagnosis: 'Seguimiento', data: { painLevel: 5, treatedZones: ['espalda baja'], sessionNumber: 2 } },
    ]
  },
  { id: 'o2', firstName: 'Silvia', lastName: 'Marín', gender: 'Femenino', dob: '1996-12-12', contact: '7733-3344', email: 'silvia.marin@email.com', history: [{ id: 'h22', date: '2024-03-10', specialty: 'Fisioterapia', diagnosis: 'Esguince Tobillo', data: { painLevel: 6, treatedZones: ['tobillo derecho'], sessionNumber: 3 } }] },
  { id: 'o3', firstName: 'Fernando', lastName: 'Paz', gender: 'Masculino', dob: '1970-01-30', contact: '7733-5566', email: 'fernando.paz@email.com', history: [{ id: 'h23', date: '2024-03-12', specialty: 'Ortopedia', diagnosis: 'Osteoartritis Rodilla', data: { painLevel: 7, treatedZones: ['rodilla izquierda'], sessionNumber: 5 } }] },
  { id: 'o4', firstName: 'Claudia', lastName: 'Rivas', gender: 'Femenino', dob: '1985-05-18', contact: '7733-7788', email: 'claudia.rivas@email.com', history: [{ id: 'h24', date: '2024-03-14', specialty: 'Fisioterapia', diagnosis: 'Tendinitis Hombro', data: { painLevel: 4, treatedZones: ['hombro derecho'], sessionNumber: 4 } }] },
  { id: 'o5', firstName: 'Miguel', lastName: 'Ángel', gender: 'Masculino', dob: '1992-09-09', contact: '7733-9900', email: 'miguel.angel@email.com', history: [{ id: 'h25', date: '2024-03-16', specialty: 'Ortopedia', diagnosis: 'Fractura Radio', data: { painLevel: 3, treatedZones: ['muñeca izquierda'], sessionNumber: 8 } }] },

  // Cirugía General / Médico General (10+)
  {
    id: 's1',
    firstName: 'Antonio',
    lastName: 'Guidos',
    gender: 'Masculino',
    dob: '1965-11-11',
    contact: '7744-1122',
    email: 'antonio.guidos@email.com',
    history: [
      { id: 'h26', date: '2024-03-01', specialty: 'Médico General', diagnosis: 'Hipertensión Arterial', data: { bloodPressure: '140/90', surgeryStatus: 'N/A' }, prescriptions: [{
        id: 'rx-3', patientId: 's1', doctorId: '1', date: '2024-03-01', specialty: 'Médico General', items: [{ medication: 'Amoxicilina 500mg', dosage: '1 tableta', frequency: 'Cada 8 horas', duration: '7 días', instructions: 'Tomar después de los alimentos.' }]
      }] },
    ]
  },
  { id: 's2', firstName: 'Laura', lastName: 'Mejía', gender: 'Femenino', dob: '1975-04-04', contact: '7744-3344', email: 'laura.mejia@email.com', history: [{ id: 'h27', date: '2024-03-05', specialty: 'Cirugía General', diagnosis: 'Colelitiasis', data: { surgeryStatus: 'Pendiente', surgeryDate: '2024-04-15' } }] },
  { id: 's3', firstName: 'Oscar', lastName: 'Reyes', gender: 'Masculino', dob: '1980-08-08', contact: '7744-5566', email: 'oscar.reyes@email.com', history: [{ id: 'h28', date: '2024-03-08', specialty: 'Médico General', diagnosis: 'Diabetes Tipo 2', data: { glucose: 150, surgeryStatus: 'N/A' } }] },
  { id: 's4', firstName: 'Daniela', lastName: 'Ortiz', gender: 'Femenino', dob: '1990-10-10', contact: '7744-7788', email: 'daniela.ortiz@email.com', history: [{ id: 'h29', date: '2024-03-10', specialty: 'Cirugía General', diagnosis: 'Hernia Inguinal', data: { surgeryStatus: 'Completada', surgeryDate: '2024-03-01' } }] },
  { id: 's5', firstName: 'Gabriel', lastName: 'Sanz', gender: 'Masculino', dob: '1985-02-02', contact: '7744-9900', email: 'gabriel.sanz@email.com', history: [{ id: 'h30', date: '2024-03-12', specialty: 'Médico General', diagnosis: 'Infección Respiratoria', data: { temp: 38.5, surgeryStatus: 'N/A' } }] },
  { id: 's6', firstName: 'Victoria', lastName: 'Blanco', gender: 'Femenino', dob: '1998-06-06', contact: '7755-1122', email: 'victoria.blanco@email.com', history: [{ id: 'h31', date: '2024-03-14', specialty: 'Cirugía General', diagnosis: 'Apendicitis', data: { surgeryStatus: 'Completada', surgeryDate: '2024-03-13', hospitalizationNeeded: true } }] },
  { id: 's7', firstName: 'Andrés', lastName: 'Funes', gender: 'Masculino', dob: '1972-01-01', contact: '7755-3344', email: 'andres.funes@email.com', history: [{ id: 'h32', date: '2024-03-15', specialty: 'Médico General', diagnosis: 'Gastritis Crónica', data: { surgeryStatus: 'N/A' } }] },
  { id: 's8', firstName: 'Isabel', lastName: 'Roca', gender: 'Femenino', dob: '1988-09-09', contact: '7755-5566', email: 'isabel.roca@email.com', history: [{ id: 'h33', date: '2024-03-16', specialty: 'Cirugía General', diagnosis: 'Lipoma Espalda', data: { surgeryStatus: 'Pendiente', surgeryDate: '2024-03-25' } }] },
  { id: 's9', firstName: 'Hugo', lastName: 'Sánchez', gender: 'Masculino', dob: '1960-05-05', contact: '7755-7788', email: 'hugo.sanchez@email.com', history: [{ id: 'h34', date: '2024-03-17', specialty: 'Médico General', diagnosis: 'Control Próstata', data: { surgeryStatus: 'N/A' } }] },
  { id: 's10', firstName: 'Raquel', lastName: 'Mora', gender: 'Femenino', dob: '1995-03-03', contact: '7755-9900', email: 'raquel.mora@email.com', history: [{ id: 'h35', date: '2024-03-18', specialty: 'Cirugía General', diagnosis: 'Quiste Sebáceo', data: { surgeryStatus: 'Completada', surgeryDate: '2024-03-15' } }] },
];

export const MOCK_APPOINTMENTS: Appointment[] = MOCK_PATIENTS.map((p, i) => ({
  id: `a${i}`,
  patientId: p.id,
  doctorId: '1',
  date: new Date(Date.now() + (i - 10) * 24 * 60 * 60 * 1000).toISOString(),
  status: i % 5 === 0 ? 'En Consulta' : i % 3 === 0 ? 'Completada' : 'Pendiente',
  specialty: p.history?.[0]?.specialty || 'Médico General'
}));
