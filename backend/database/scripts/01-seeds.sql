INSERT INTO TiposHabitacion (Nombre, Descripcion, PrecioPorNoche, ImagenURL) VALUES
('Simple', 'Una habitación acogedora para un viajero solitario.', 50.00, 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
('Doble', 'Espacio perfecto para dos personas, con todas las comodidades.', 80.00, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop'),
('Suite', 'Lujo y confort con espacio adicional y vistas panorámicas.', 150.00, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop');

INSERT INTO Servicios (Nombre, Descripcion) VALUES
('WiFi Gratis', 'Conexión a internet de alta velocidad en todo el hotel.'),
('Aire Acondicionado', 'Control de clima individual.'),
('TV con Cable', 'Amplia selección de canales.'),
('Minibar', 'Surtido de bebidas y snacks.'),
('Jacuzzi', 'Bañera de hidromasaje privada.');

INSERT INTO TiposHabitacion_Servicios (ID_TipoHabitacion, ID_Servicio) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1), (3, 2), (3, 3),
-- Doble y Suite tienen Minibar
(2, 4), (3, 4),
-- Solo la Suite tiene Jacuzzi
(3, 5);

-- 6 Simples (Pisos 1, 2)
INSERT INTO Habitaciones (ID_TipoHabitacion, NumeroHabitacion, Piso) VALUES
(1, '101', 1), (1, '102', 1), (1, '201', 2), (1, '202', 2), (1, '301', 3), (1, '302', 3);
-- 6 Dobles (Pisos 3, 4)
INSERT INTO Habitaciones (ID_TipoHabitacion, NumeroHabitacion, Piso) VALUES
(2, '103', 1), (2, '203', 2), (2, '303', 3), (2, '401', 4), (2, '402', 4), (2, '403', 4);
-- 3 Suites (Piso 5)
INSERT INTO Habitaciones (ID_TipoHabitacion, NumeroHabitacion, Piso) VALUES
(3, '501', 5), (3, '502', 5), (3, '503', 5);

INSERT INTO EstadosReserva (NombreEstado) VALUES
('Activa'),
('Cancelada'),
('Completada');

INSERT INTO Operadores (Email, ContrasenaHash, Nombre, Apellido) VALUES
('operador@hotel.com', '$2b$10$lMhae2T2Xr8Or38yvxB9HeBJAMFZhEV1w673PfJHajQNeZX47PtFW', 'Operador', 'Principal');

