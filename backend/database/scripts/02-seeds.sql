
-- Reservas de ejemplo
INSERT INTO Reservas (ID_Habitacion, FechaCheckIn, FechaCheckOut, NombreCliente, ApellidoCliente, DNICliente, EmailCliente, ID_EstadoReserva, Pagada) VALUES
-- Suite (ID_Habitacion: 13-15), TipoHabitacion: 3
(13, '2025-11-01', '2025-11-05', 'Juan', 'Perez', '12345678A', 'juan.perez@email.com', 1, 1),
(14, '2025-11-10', '2025-11-15', 'Maria', 'Lopez', '87654321B', 'maria.lopez@email.com', 1, 0),

-- Doble (ID_Habitacion: 7-12), TipoHabitacion: 2
(7, '2025-11-02', '2025-11-06', 'Carlos', 'Garcia', '11223344C', 'carlos.garcia@email.com', 1, 1),
(8, '2025-12-20', '2025-12-24', 'Ana', 'Martinez', '44332211D', 'ana.martinez@email.com', 1, 0),

-- Simple (ID_Habitacion: 1-6), TipoHabitacion: 1
(1, '2025-10-30', '2025-11-03', 'Lucia', 'Rodriguez', '55667788E', 'lucia.rodriguez@email.com', 3, 1),
(2, '2025-11-12', '2025-11-18', 'Javier', 'Sanchez', '88776655F', 'javier.sanchez@email.com', 2, 0),
(3, '2026-01-10', '2026-01-15', 'Elena', 'Gomez', '99887766G', 'elena.gomez@email.com', 1, 0);
