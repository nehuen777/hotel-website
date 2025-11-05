CREATE DATABASE hotel_db;
GO

USE hotel_db;
GO

CREATE TABLE TiposHabitacion (
    ID_TipoHabitacion INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(50) NOT NULL UNIQUE,
    Descripcion TEXT,
    PrecioPorNoche DECIMAL(10, 2) NOT NULL,
    ImagenURL VARCHAR(255)
);

CREATE TABLE Servicios (
    ID_Servicio INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL UNIQUE,
    Descripcion TEXT
);

CREATE TABLE TiposHabitacion_Servicios (
    ID_TipoHabitacion INT NOT NULL,
    ID_Servicio INT NOT NULL,
    PRIMARY KEY (ID_TipoHabitacion, ID_Servicio),
    FOREIGN KEY (ID_TipoHabitacion) REFERENCES TiposHabitacion(ID_TipoHabitacion),
    FOREIGN KEY (ID_Servicio) REFERENCES Servicios(ID_Servicio)
);

CREATE TABLE Habitaciones (
    ID_Habitacion INT PRIMARY KEY IDENTITY(1,1),
    ID_TipoHabitacion INT NOT NULL,
    NumeroHabitacion VARCHAR(10) NOT NULL UNIQUE,
    Piso INT NOT NULL,
    Abierta BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (ID_TipoHabitacion) REFERENCES TiposHabitacion(ID_TipoHabitacion)
);

CREATE TABLE Operadores (
    ID_Operador INT PRIMARY KEY IDENTITY(1,1),
    Email VARCHAR(100) NOT NULL UNIQUE,
    ContrasenaHash VARCHAR(255) NOT NULL,
    Nombre VARCHAR(100),
    Apellido VARCHAR(100)
);

CREATE TABLE EstadosReserva (
    ID_EstadoReserva INT PRIMARY KEY IDENTITY(1,1),
    NombreEstado VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Reservas (
    ID_Reserva INT PRIMARY KEY IDENTITY(1,1),
    ID_Habitacion INT NOT NULL,
    FechaCheckIn DATE NOT NULL,
    FechaCheckOut DATE NOT NULL,
    NombreCliente VARCHAR(100) NOT NULL,
    ApellidoCliente VARCHAR(100) NOT NULL,
    DNICliente VARCHAR(20) NOT NULL,
    EmailCliente VARCHAR(100) NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    Pagada BIT NOT NULL DEFAULT 0,
    ID_EstadoReserva INT NOT NULL DEFAULT 1,
    FOREIGN KEY (ID_Habitacion) REFERENCES Habitaciones(ID_Habitacion),
    FOREIGN KEY (ID_EstadoReserva) REFERENCES EstadosReserva(ID_EstadoReserva)
);

CREATE TABLE Consultas (
    ID_Consulta INT PRIMARY KEY IDENTITY(1,1),
    Email VARCHAR(100) NOT NULL,
    Asunto VARCHAR(255) NOT NULL,
    Mensaje TEXT NOT NULL,
    FechaEnvio DATETIME DEFAULT GETDATE(),
    Respondida BIT NOT NULL DEFAULT 0
);
