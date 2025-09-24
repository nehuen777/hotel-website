-- 1. Insertar Tipos de Habitación
INSERT INTO TiposHabitacion (Nombre, Descripcion, PrecioPorNoche) VALUES
('Simple', 'Una habitación acogedora para un viajero solitario.', 50.00),
('Doble', 'Espacio y comodidad para dos personas.', 85.00),
('Suite', 'Lujo y servicios exclusivos con las mejores vistas.', 150.00);

-- 2. Insertar Servicios
INSERT INTO Servicios (Nombre, Descripcion) VALUES
('WiFi Gratis', 'Conexión a internet de alta velocidad en todo el hotel.'),
('Aire Acondicionado', 'Control de clima individual.'),
('TV con Cable', 'Amplia selección de canales.'),
('Minibar', 'Surtido de bebidas y snacks.'),
('Jacuzzi', 'Bañera de hidromasaje privada.');

-- 3. Asociar Servicios a Tipos de Habitación
-- Todas tienen WiFi, A/C y TV
INSERT INTO TiposHabitacion_Servicios (ID_TipoHabitacion, ID_Servicio) VALUES
(1, 1), (1, 2), (1, 3), -- Simple
(2, 1), (2, 2), (2, 3), -- Doble
(3, 1), (3, 2), (3, 3); -- Suite
-- Doble y Suite tienen Minibar
INSERT INTO TiposHabitacion_Servicios (ID_TipoHabitacion, ID_Servicio) VALUES
(2, 4), (3, 4);
-- Solo la Suite tiene Jacuzzi
INSERT INTO TiposHabitacion_Servicios (ID_TipoHabitacion, ID_Servicio) VALUES
(3, 5);

-- 4. Insertar las 15 Habitaciones Físicas
-- 6 Simples (Pisos 1, 2)
INSERT INTO Habitaciones (ID_TipoHabitacion, NumeroHabitacion, Piso) VALUES
(1, '101', 1), (1, '102', 1), (1, '201', 2), (1, '202', 2), (1, '301', 3), (1, '302', 3);
-- 6 Dobles (Pisos 3, 4)
INSERT INTO Habitaciones (ID_TipoHabitacion, NumeroHabitacion, Piso) VALUES
(2, '103', 1), (2, '203', 2), (2, '303', 3), (2, '401', 4), (2, '402', 4), (2, '403', 4);
-- 3 Suites (Piso 5)
INSERT INTO Habitaciones (ID_TipoHabitacion, NumeroHabitacion, Piso) VALUES
(3, '501', 5), (3, '502', 5), (3, '503', 5);

-- 5. Ejemplo de una Reserva
-- Reserva la habitación 101 (Simple)
INSERT INTO Reservas (ID_Habitacion, FechaCheckIn, FechaCheckOut, NombreCliente, ApellidoCliente, DNICliente, EmailCliente) VALUES
(1, '2024-10-15', '2024-10-20', 'Juan', 'Perez', '12345678A', 'juan.perez@email.com');