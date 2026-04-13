/*
  ESQUEMA DE BASE DE DATOS PROPUESTO (SQL)
  ----------------------------------------
  Este esquema utiliza una aproximación híbrida: Tablas relacionales para la estructura base
  y una columna JSONB (en PostgreSQL) o TEXT (en SQLite) para los datos dinámicos de cada especialidad.
  Esto permite flexibilidad sin la complejidad de crear 50 tablas diferentes.
*/

-- 1. Catálogo de Especialidades
CREATE TABLE specialties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, -- Psicología, Nutrición, etc.
    description TEXT
);

-- 2. Usuarios (Médicos y Personal)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'doctor', 'specialist')) NOT NULL,
    specialty_id INTEGER,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

-- 3. Pacientes
CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob DATE NOT NULL,
    gender TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    blood_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Citas
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    specialty_id INTEGER NOT NULL,
    appointment_date DATETIME NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
    reason TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

-- 5. Expediente Médico / Evolución (Formularios Dinámicos)
CREATE TABLE medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    specialty_id INTEGER NOT NULL,
    
    -- Datos base comunes a todas las consultas
    weight_kg REAL,
    height_cm REAL,
    blood_pressure TEXT,
    heart_rate INTEGER,
    temperature REAL,
    diagnosis TEXT,
    treatment_plan TEXT,
    
    -- DATOS DINÁMICOS POR ESPECIALIDAD
    -- Se guarda como JSON para permitir campos específicos sin cambiar el esquema
    specialty_data JSON, 
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);
