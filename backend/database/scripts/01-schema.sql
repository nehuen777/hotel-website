-- =====================================================================
-- Script para la Creación de la Base de Datos del Hotel
-- =====================================================================

-- -----------------------------------------------------
-- Tabla: TiposHabitacion
-- Almacena los tipos de habitación disponibles (Simple, Doble, Suite).
-- Responde a HU-02.
-- -----------------------------------------------------
CREATE TABLE TiposHabitacion (
    ID_TipoHabitacion INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion TEXT,
    PrecioPorNoche DECIMAL(10, 2) NOT NULL
);

-- -----------------------------------------------------
-- Tabla: Servicios
-- Catálogo de todos los servicios que el hotel puede ofrecer.
-- -----------------------------------------------------
CREATE TABLE Servicios (
    ID_Servicio INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Descripcion TEXT
);

-- -----------------------------------------------------
-- Tabla: TiposHabitacion_Servicios (Tabla de Unión)
-- Asocia los servicios a cada tipo de habitación.
-- Responde a la pregunta sobre servicios fijos por tipo.
-- -----------------------------------------------------
CREATE TABLE TiposHabitacion_Servicios (
    ID_TipoHabitacion INT NOT NULL,
    ID_Servicio INT NOT NULL,
    PRIMARY KEY (ID_TipoHabitacion, ID_Servicio), -- Clave primaria compuesta
    FOREIGN KEY (ID_TipoHabitacion) REFERENCES TiposHabitacion(ID_TipoHabitacion),
    FOREIGN KEY (ID_Servicio) REFERENCES Servicios(ID_Servicio)
);

-- -----------------------------------------------------
-- Tabla: Habitaciones
-- Inventario de las 15 habitaciones físicas del hotel.
-- Responde a HU-03 y a la pregunta sobre el inventario.
-- -----------------------------------------------------
CREATE TABLE Habitaciones (
    ID_Habitacion INT PRIMARY KEY IDENTITY(1,1),
    ID_TipoHabitacion INT NOT NULL,
    NumeroHabitacion VARCHAR(10) NOT NULL UNIQUE,
    Piso INT NOT NULL,
    FOREIGN KEY (ID_TipoHabitacion) REFERENCES TiposHabitacion(ID_TipoHabitacion)
);

-- -----------------------------------------------------
-- Tabla: Reservas
-- Almacena cada una de las reservas realizadas.
-- Responde a HU-04 y a las preguntas sobre asignación y datos del cliente.
-- -----------------------------------------------------
CREATE TABLE Reservas (
    ID_Reserva INT PRIMARY KEY IDENTITY(1,1),
    ID_Habitacion INT NOT NULL,
    FechaCheckIn DATE NOT NULL,
    FechaCheckOut DATE NOT NULL,
    NombreCliente VARCHAR(100) NOT NULL,
    ApellidoCliente VARCHAR(100) NOT NULL,
    DNICliente VARCHAR(20) NOT NULL,
    EmailCliente VARCHAR(100) NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(), -- Se registra automáticamente la fecha de creación
    FOREIGN KEY (ID_Habitacion) REFERENCES Habitaciones(ID_Habitacion)
);

-- -----------------------------------------------------
-- Tabla: Consultas
-- Almacena los mensajes enviados desde el formulario de contacto.
-- Responde a HU-05 y a la última pregunta.
-- -----------------------------------------------------
CREATE TABLE Consultas (
    ID_Consulta INT PRIMARY KEY IDENTITY(1,1),
    Email VARCHAR(100) NOT NULL,
    Asunto VARCHAR(255) NOT NULL,
    Mensaje TEXT NOT NULL,
    FechaEnvio DATETIME DEFAULT GETDATE() -- Se registra automáticamente la fecha de envío
);