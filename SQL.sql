-- Crear la base de datos
CREATE DATABASE Aulanote2;
USE Aulanote2;

-- Tabla de usuarios
CREATE TABLE usuario (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    cargo VARCHAR(100) NOT NULL
);

-- Datos de ejemplo para usuario
INSERT INTO usuario (nombre, apellido, correo, contrasena, cargo) VALUES
('Sofía', 'Martínez', 'sofia.martinez@example.com', 'pass456', 'estudiante'),
('Miguel', 'Hernández', 'miguel.hernandez@example.com', '123abc', 'profesor'),
('Valentina', 'López', 'valentina.lopez@example.com', 'clave789', 'estudiante'),
('Diego', 'García', 'diego.garcia@example.com', 'qwe123', 'profesor'),
('Camila', 'Rodríguez', 'camila.rodriguez@example.com', 'mypassword', 'estudiante'),
('Andrés', 'Sánchez', 'andres.sanchez@example.com', 'abc123', 'profesor'),
('Isabella', 'Ramírez', 'isabella.ramirez@example.com', '123456', 'estudiante'),
('Sebastián', 'Vargas', 'sebastian.vargas@example.com', 'pass987', 'profesor'),
('Laura', 'Castillo', 'laura.castillo@example.com', 'miClave', 'estudiante'),
('Fernando', 'Molina', 'fernando.molina@example.com', 'claveSecreta', 'profesor');

-- Tabla cursos
CREATE TABLE cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    profesor_id INT NOT NULL,
    CONSTRAINT fk_curso_profesor FOREIGN KEY (profesor_id) REFERENCES usuario(Id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO cursos (nombre, descripcion, profesor_id) VALUES
('Matemáticas Básicas', 'Curso inicial de matemáticas para principiantes', 2),
('Programación en Java', 'Introducción a Java y programación orientada a objetos', 2),
('Física I', 'Conceptos fundamentales de la mecánica clásica', 4),
('Base de Datos', 'Diseño y modelado de bases de datos relacionales', 6),
('Redes de Computadores', 'Principios básicos de redes y protocolos de comunicación', 8),
('Inteligencia Artificial', 'Fundamentos de AI y machine learning', 10);


-- Datos de ejemplo para cursos
INSERT INTO cursos (nombre, descripcion, fecha_creacion, profesor_id) VALUES 
('Matemáticas I', 'Curso introductorio a álgebra, trigonometría y funciones.', NOW(), 2),
('Historia Universal', 'Repaso de los principales acontecimientos de la historia mundial.', NOW(), 4),
('Programación en Java', 'Fundamentos de programación orientada a objetos en Java.', NOW(), 6),
('Física General', 'Cinemática, dinámica, energía y leyes de Newton.', NOW(), 8),
('Bases de Datos', 'Introducción a SQL y modelado relacional.', NOW(), 10);

-- Tabla inscripciones
CREATE TABLE inscripciones (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_inscripcion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(Id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_inscripcion_curso FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
        ON DELETE CASCADE ON UPDATE CASCADE
);
USE aulanote2;  
-- Inserción de inscripciones para estudiantes
INSERT INTO inscripciones (id_usuario, id_curso) VALUES
((SELECT Id FROM usuario WHERE correo = 'sofia.martinez@example.com'), 1),
((SELECT Id FROM usuario WHERE correo = 'valentina.lopez@example.com'), 1),
((SELECT Id FROM usuario WHERE correo = 'camila.rodriguez@example.com'), 2),
((SELECT Id FROM usuario WHERE correo = 'isabella.ramirez@example.com'), 2),
((SELECT Id FROM usuario WHERE correo = 'laura.castillo@example.com'), 3);


-- Tabla tareas
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_actividad VARCHAR(100) NOT NULL,
    fecha_limite DATETIME NOT NULL,
    descripcion TEXT NOT NULL,
    profesor_id INT NOT NULL,
    CONSTRAINT fk_tarea_profesor FOREIGN KEY (profesor_id) REFERENCES usuario(Id)
);

-- Datos de ejemplo para tareas
INSERT INTO tareas (nombre_actividad, fecha_limite, descripcion, profesor_id) VALUES
('Trabajo Práctico 1 - Programación', '2025-09-30 23:59:00', 'Desarrollar un programa en Java que implemente recursividad con Fibonacci.', 2),
('Ensayo de Historia', '2025-10-05 23:59:00', 'Escribir un ensayo de mínimo 3 páginas sobre la Revolución Industrial.', 4),
('Proyecto de Base de Datos', '2025-10-10 23:59:00', 'Diseñar un modelo entidad-relación y normalizar hasta 3FN.', 6),
('Exposición de Física', '2025-10-12 18:00:00', 'Preparar exposición sobre movimiento parabólico con ejemplos prácticos.', 8),
('Práctica de Inglés', '2025-10-15 23:59:00', 'Grabar un audio de 3 minutos hablando sobre tu rutina diaria.', 10);

-- Tabla entregas
CREATE TABLE entregas (
    id_entrega INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_tarea VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo TEXT NOT NULL,
    fecha_entrega TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    calificacion DECIMAL(5,2) NULL,
    curso_id INT NOT NULL,
    CONSTRAINT fk_entrega_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(Id),
    CONSTRAINT fk_entrega_curso FOREIGN KEY (curso_id) REFERENCES cursos(id_curso)
);

-- Datos de ejemplo para entregas
INSERT INTO entregas (id_usuario, nombre_tarea, nombre_archivo, ruta_archivo, fecha_entrega, calificacion, curso_id) VALUES
(1, 'Trabajo Práctico 1 - Programación', 'tp1.pdf', '/uploads/tp1.pdf', '2025-09-15 14:30:00', 4.5, 1),
(2, 'Ensayo de Historia', 'ensayo.docx', '/uploads/ensayo.docx', '2025-09-16 10:00:00', 3.8, 2),
(3, 'Proyecto de Base de Datos', 'modeloER.png', '/uploads/modeloER.png', '2025-09-17 09:45:00', NULL, 3);

-- Tabla foros
CREATE TABLE foro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    autor_id INT,
    CONSTRAINT fk_foro_usuario FOREIGN KEY (autor_id) REFERENCES usuario(Id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Datos de ejemplo foro
INSERT INTO foro (titulo, descripcion, autor_id) VALUES
('Introducción a Java', 'Discute dudas, comparte tips y ejemplos de programación en Java.', 1),
('Matemáticas Discretas', 'Comparte ejercicios y resuelve dudas sobre lógica, conjuntos y grafos.', 2),
('Proyecto Final de Sistemas', 'Espacio para hablar sobre avances y problemas del proyecto final.', 3);

-- Tabla comentarios foro
CREATE TABLE comentarios_foro (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_foro INT NOT NULL,
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(Id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comentario_foro FOREIGN KEY (id_foro) REFERENCES foro(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Datos de ejemplo comentarios foro
INSERT INTO comentarios_foro (contenido, id_usuario, id_foro) VALUES
('¡Este foro es muy interesante!', 1, 1),
('Estoy de acuerdo con lo que se dijo en el post.', 2, 1),
('Tengo una duda sobre el tema tratado.', 3, 2);

-- Tabla mensajes
CREATE TABLE mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_remitente INT NOT NULL,
    id_destinatario INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_mensajes_remitente FOREIGN KEY (id_remitente) REFERENCES usuario(Id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_mensajes_destinatario FOREIGN KEY (id_destinatario) REFERENCES usuario(Id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
