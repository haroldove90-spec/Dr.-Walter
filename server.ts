import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Medical Dashboard API is running" });
  });

  // Mock Database Data
  const patients = [
    { id: "1", firstName: "Ana", lastName: "García", dob: "1985-05-12", gender: "Femenino", contact: "7766-5544", history: [
      { id: "h1", date: "2024-01-10", weight: 65, specialty: "Nutrición", diagnosis: "Sobrepeso leve", data: { fatPercentage: 28, muscleMass: 45 } },
      { id: "h2", date: "2024-02-15", weight: 63, specialty: "Nutrición", diagnosis: "Evolución favorable", data: { fatPercentage: 26, muscleMass: 46 } },
      { id: "h3", date: "2024-03-20", weight: 61, specialty: "Nutrición", diagnosis: "Meta alcanzada", data: { fatPercentage: 24, muscleMass: 47 } },
    ]},
    { id: "2", firstName: "Carlos", lastName: "Mendoza", dob: "1990-11-23", gender: "Masculino", contact: "7122-3344", history: [
      { id: "h4", date: "2024-01-05", painLevel: 8, specialty: "Fisioterapia", diagnosis: "Esguince tobillo", data: { area: "Tobillo derecho" } },
      { id: "h5", date: "2024-01-20", painLevel: 5, specialty: "Fisioterapia", diagnosis: "Recuperación media", data: { area: "Tobillo derecho" } },
      { id: "h6", date: "2024-02-10", painLevel: 2, specialty: "Fisioterapia", diagnosis: "Fase final", data: { area: "Tobillo derecho" } },
    ]},
    { id: "3", firstName: "Elena", lastName: "Rodríguez", dob: "1978-02-15", gender: "Femenino", contact: "7888-1122" },
    { id: "4", firstName: "Roberto", lastName: "Sosa", dob: "1965-08-30", gender: "Masculino", contact: "7000-9988" },
    { id: "5", firstName: "Lucía", lastName: "Pérez", dob: "1995-12-01", gender: "Femenino", contact: "7222-5566" },
    { id: "6", firstName: "Mario", lastName: "López", dob: "1982-04-10", gender: "Masculino", contact: "7333-4455" },
    { id: "7", firstName: "Sofía", lastName: "Castro", dob: "1992-09-18", gender: "Femenino", contact: "7444-5566" },
    { id: "8", firstName: "Javier", lastName: "Ortiz", dob: "1975-06-25", gender: "Masculino", contact: "7555-6677" },
    { id: "9", firstName: "Carmen", lastName: "Vega", dob: "1988-03-14", gender: "Femenino", contact: "7666-7788" },
    { id: "10", firstName: "Luis", lastName: "Rivas", dob: "1998-10-05", gender: "Masculino", contact: "7777-8899" },
    { id: "11", firstName: "Marta", lastName: "Sánchez", dob: "1980-01-20", gender: "Femenino", contact: "7888-9900" },
    { id: "12", firstName: "Diego", lastName: "Torres", dob: "1994-07-12", gender: "Masculino", contact: "7999-0011" },
    { id: "13", firstName: "Laura", lastName: "Gómez", dob: "1987-11-30", gender: "Femenino", contact: "7000-1122" },
    { id: "14", firstName: "Andrés", lastName: "Díaz", dob: "1970-05-05", gender: "Masculino", contact: "7111-2233" },
    { id: "15", firstName: "Patricia", lastName: "Luna", dob: "1991-08-22", gender: "Femenino", contact: "7222-3344" },
    { id: "16", firstName: "Ricardo", lastName: "Mejía", dob: "1979-04-15", gender: "Masculino", contact: "7333-4455" },
    { id: "17", firstName: "Beatriz", lastName: "Solís", dob: "1986-09-02", gender: "Femenino", contact: "7444-5566" },
    { id: "18", firstName: "Fernando", lastName: "Reyes", dob: "1968-12-10", gender: "Masculino", contact: "7555-6677" },
    { id: "19", firstName: "Gabriela", lastName: "Pinto", dob: "1993-02-28", gender: "Femenino", contact: "7666-7788" },
    { id: "20", firstName: "Héctor", lastName: "Varela", dob: "1981-07-14", gender: "Masculino", contact: "7777-8899" },
    { id: "21", firstName: "Isabel", lastName: "Mora", dob: "1974-10-31", gender: "Femenino", contact: "7888-9900" },
  ];

  const appointments = [
    { id: "101", patientId: "1", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Ginecología" },
    { id: "102", patientId: "2", doctorId: "doc1", date: new Date().toISOString(), status: "En Consulta", specialty: "Nutrición" },
    { id: "103", patientId: "3", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Fisioterapia" },
    { id: "104", patientId: "4", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Ortopedia" },
    { id: "105", patientId: "5", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Psicología" },
    { id: "106", patientId: "6", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Cirugía General" },
    { id: "107", patientId: "7", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Médico General" },
    { id: "108", patientId: "8", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Ginecología" },
    { id: "109", patientId: "9", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Nutrición" },
    { id: "110", patientId: "10", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Fisioterapia" },
    { id: "111", patientId: "11", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Ortopedia" },
    { id: "112", patientId: "12", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Psicología" },
    { id: "113", patientId: "13", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Cirugía General" },
    { id: "114", patientId: "14", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Médico General" },
    { id: "115", patientId: "15", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Ginecología" },
    { id: "116", patientId: "16", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Nutrición" },
    { id: "117", patientId: "17", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Fisioterapia" },
    { id: "118", patientId: "18", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Ortopedia" },
    { id: "119", patientId: "19", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Psicología" },
    { id: "120", patientId: "20", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Cirugía General" },
    { id: "121", patientId: "21", doctorId: "doc1", date: new Date().toISOString(), status: "Pendiente", specialty: "Médico General" },
  ];

  const payments = [
    { id: "p1", appointmentId: "1", patientId: "1", amount: 80, method: "Efectivo", date: "2024-04-13", specialistFee: 56, clinicCommission: 24 },
    { id: "p2", appointmentId: "2", patientId: "2", amount: 72, method: "Tarjeta", date: "2024-04-13", specialistFee: 50.4, clinicCommission: 21.6, discount: 8 },
    { id: "p3", appointmentId: "3", patientId: "3", amount: 350, method: "Transferencia", date: "2024-04-12", specialistFee: 245, clinicCommission: 105, packageName: "Paquete Fisioterapia" },
  ];

  app.get("/api/patients", (req, res) => {
    res.json(patients);
  });

  app.get("/api/appointments", (req, res) => {
    res.json(appointments);
  });

  app.get("/api/payments", (req, res) => {
    res.json(payments);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
