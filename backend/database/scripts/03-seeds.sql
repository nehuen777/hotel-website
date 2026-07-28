USE hotel_db;
GO

-- =====================================================================
-- 03-SEEDS: DATOS ESTRATÉGICOS PARA PROBAR FILTROS DEL DASHBOARD
-- Fecha de referencia del sistema: 28 de Julio de 2026
-- =====================================================================

-- ---------------------------------------------------------------------
-- GRUPO 1: ÚLTIMOS 7 DÍAS (Creadas entre el 21/07 y el 28/07)
-- Se verán en: "Últimos 7 Días", "Este Mes" y "Año Actual"
-- ---------------------------------------------------------------------
INSERT INTO Reservas (ID_Habitacion, FechaCheckIn, FechaCheckOut, NombreCliente, ApellidoCliente, DNICliente, EmailCliente, ID_EstadoReserva, Pagada, FechaCreacion) VALUES
(15, '2026-07-28', '2026-08-02', 'Lionel', 'Messi', '30112233', 'leomessi@correo.com', 1, 0, '2026-07-26 14:30:00'), -- Suite
(4, '2026-07-28', '2026-07-31', 'Emanuel', 'Ginóbili', '22446688', 'manu@correo.com', 1, 1, '2026-07-27 09:15:00'); -- Simple


-- ---------------------------------------------------------------------
-- GRUPO 2: ESTE MES (Creadas entre el 01/07 y el 20/07)
-- Se verán en: "Este Mes" y "Año Actual" (PERO NO en Últimos 7 Días)
-- ---------------------------------------------------------------------
INSERT INTO Reservas (ID_Habitacion, FechaCheckIn, FechaCheckOut, NombreCliente, ApellidoCliente, DNICliente, EmailCliente, ID_EstadoReserva, Pagada, FechaCreacion) VALUES
(9, '2026-07-20', '2026-07-28', 'Martín', 'Palermo', '20334455', 'mpalermo@correo.com', 1, 1, '2026-07-05 10:00:00'), -- Doble
(11, '2026-07-25', '2026-07-30', 'Mirtha', 'Legrand', '05112233', 'mirtha@correo.com', 1, 1, '2026-07-10 12:00:00'); -- Doble


-- ---------------------------------------------------------------------
-- GRUPO 3: MES ANTERIOR (Creadas en Junio 2026)
-- Se verán en: "Mes Anterior" y "Año Actual"
-- ---------------------------------------------------------------------
INSERT INTO Reservas (ID_Habitacion, FechaCheckIn, FechaCheckOut, NombreCliente, ApellidoCliente, DNICliente, EmailCliente, ID_EstadoReserva, Pagada, FechaCreacion) VALUES
(13, '2026-06-10', '2026-06-15', 'Guillermo', 'Francella', '14778855', 'gfran@correo.com', 3, 1, '2026-06-02 11:20:00'), -- Suite (Liberada)
(5, '2026-06-20', '2026-06-25', 'Susana', 'Giménez', '10223344', 'su@correo.com', 2, 0, '2026-06-15 18:00:00'), -- Simple (Cancelada)
(8, '2026-06-28', '2026-07-02', 'Ricardo', 'Darín', '12558899', 'rdarin@correo.com', 3, 1, '2026-06-25 16:45:00'); -- Doble (Liberada)


-- ---------------------------------------------------------------------
-- GRUPO 4: AÑO ACTUAL (Resto de 2026, ej. Marzo, Abril, Mayo)
-- Se verán SOLO al seleccionar "Año Actual"
-- ---------------------------------------------------------------------
INSERT INTO Reservas (ID_Habitacion, FechaCheckIn, FechaCheckOut, NombreCliente, ApellidoCliente, DNICliente, EmailCliente, ID_EstadoReserva, Pagada, FechaCreacion) VALUES
(1, '2026-03-10', '2026-03-15', 'Diego', 'Maradona', '10000000', 'diego@correo.com', 3, 1, '2026-02-28 09:00:00'), -- Simple
(14, '2026-04-05', '2026-04-10', 'Gabriela', 'Sabatini', '11221122', 'gabi@correo.com', 3, 1, '2026-03-20 10:30:00'), -- Suite
(7, '2026-05-12', '2026-05-15', 'Charly', 'García', '15667788', 'charly@correo.com', 3, 1, '2026-05-01 14:00:00'); -- Doble


-- =====================================================================
-- DATOS PARA CONSULTAS PENDIENTES
-- =====================================================================
INSERT INTO Consultas (Email, Asunto, Mensaje, Respondida, FechaEnvio) VALUES
('turista1@gmail.com', 'Consulta por cochera', 'Hola, quería saber si el hotel cuenta con estacionamiento techado.', 0, '2026-07-27 08:30:00'),
('empresa@hotmail.com', 'Descuento corporativo', 'Necesitamos alojar a 5 empleados la próxima semana.', 0, '2026-07-28 11:15:00'),
('huesped_viejo@gmail.com', 'Horario de desayuno', '¿A qué hora sirven el desayuno los domingos?', 1, '2026-06-20 09:00:00');