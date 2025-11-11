create database Aulanote2;
use aulanote2;
create table usuario (
	Id int primary key unique auto_increment,
    nombre VARCHAR(50) NOT NULL,
    apellido varchar(50) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    cargo varchar (100) NOT NULL
    );
    ALTER TABLE usuario MODIFY profesor_id INT NULL;
	ALTER TABLE usuario ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

create	table Tareas (
id VARCHAR(15) PRIMARY KEY unique,
NombreActividad	varchar(100) NOT NULL,
FechaLimite	datetime NOT NULL,
Descripcion	text NOT NULL,
ProfesorID	int(50) NOT NULL
);
CREATE TABLE entregas (
    id_entrega INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_tarea VARCHAR(255) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo TEXT NOT NULL,
    fecha_entrega TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    calificacion DECIMAL(5,2) NULL,

    CONSTRAINT fk_entrega_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(Id)
);
use aulanote2;
DESCRIBE usuario;

-- NUEVOOOOO 
ALTER TABLE entregas
ADD COLUMN curso_id INT NOT NULL,
ADD CONSTRAINT fk_entrega_curso FOREIGN KEY (curso_id) REFERENCES cursos(id_curso);
ALTER TABLE entregas DROP COLUMN tarea_id;


ALTER TABLE entregas
ADD COLUMN curso_id INT NOT NULL,
ADD CONSTRAINT fk_entrega_curso FOREIGN KEY (curso_id) REFERENCES cursos(id_curso);

CREATE TABLE foro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    autor_id INT,
    CONSTRAINT fk_foro_usuario FOREIGN KEY (autor_id)
        REFERENCES usuario(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Usuario remitente
    id_remitente INT NOT NULL,
    
    -- Usuario destinatario
    id_destinatario INT NOT NULL,
    
    mensaje TEXT NOT NULL,
    
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Claves foráneas
    CONSTRAINT fk_mensajes_remitente
        FOREIGN KEY (id_remitente) REFERENCES usuario(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT fk_mensajes_destinatario
        FOREIGN KEY (id_destinatario) REFERENCES usuario(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE comentarios_foro (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Relaciones
    id_usuario INT NOT NULL,
    id_foro INT NOT NULL,

    -- Llaves foráneas
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(Id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_comentario_foro FOREIGN KEY (id_foro) REFERENCES foro(id_foro) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
use aulanote2;
ALTER TABLE comentarios_foro
CHANGE COLUMN id_comentario_padre comentario_padre_id INT NULL;

ALTER TABLE comentarios_foro
ADD COLUMN id_comentario_padre INT NULL,
ADD CONSTRAINT fk_comentario_padre
  FOREIGN KEY (id_comentario_padre)
  REFERENCES comentarios_foro(id_comentario)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE comentarios_foro
ADD CONSTRAINT fk_comentario_padre
FOREIGN KEY (comentario_padre_id)
REFERENCES comentarios_foro(id_comentario)
ON DELETE CASCADE
ON UPDATE CASCADE;



INSERT INTO usuario (nombre,apellido, correo, contrasena, cargo) VALUES
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

CREATE TABLE cursos (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE inscripciones (
    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_curso INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Asociación con usuario
    CONSTRAINT fk_inscripcion_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(Id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    -- Asociación con curso
    CONSTRAINT fk_inscripcion_curso
        FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
        ON DELETE CASCADE ON UPDATE CASCADE
);
-- Agregar la columna profesor_id
ALTER TABLE cursos 
ADD COLUMN profesor_id INT NOT NULL AFTER fecha_creacion;

-- Crear la clave foránea hacia usuario(Id)
ALTER TABLE cursos 
ADD CONSTRAINT fk_curso_profesor 
FOREIGN KEY (profesor_id) REFERENCES usuario(Id)
ON DELETE CASCADE 
ON UPDATE CASCADE;
-- Inserta cursos de prueba
INSERT INTO cursos (nombre, descripcion, fecha_creacion, profesor_id)
VALUES 
('Matemáticas I', 'Curso introductorio a álgebra, trigonometría y funciones.', NOW(), 1),
('Historia Universal', 'Repaso de los principales acontecimientos de la historia mundial.', NOW(), 2),
('Programación en Java', 'Fundamentos de programación orientada a objetos en Java.', NOW(), 3),
('Física General', 'Cinemática, dinámica, energía y leyes de Newton.', NOW(), 1),
('Bases de Datos', 'Introducción a SQL y modelado relacional.', NOW(), 3);
TRUNCATE TABLE tareas;


DROP TABLE IF EXISTS tareas;
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_actividad VARCHAR(100) NOT NULL,
    fecha_limite DATETIME NOT NULL,
    descripcion TEXT NOT NULL,
    profesor_id INT NOT NULL
);
INSERT INTO tareas (nombre_actividad, fecha_limite, descripcion, profesor_id) VALUES
('Trabajo Práctico 1 - Programación', '2025-09-30 23:59:00', 'Desarrollar un programa en Java que implemente recursividad con Fibonacci.', 1),
('Ensayo de Historia', '2025-10-05 23:59:00', 'Escribir un ensayo de mínimo 3 páginas sobre la Revolución Industrial.', 2),
('Proyecto de Base de Datos', '2025-10-10 23:59:00', 'Diseñar un modelo entidad-relación y normalizar hasta 3FN.', 3),
('Exposición de Física', '2025-10-12 18:00:00', 'Preparar exposición sobre movimiento parabólico con ejemplos prácticos.', 4),
('Práctica de Inglés', '2025-10-15 23:59:00', 'Grabar un audio de 3 minutos hablando sobre tu rutina diaria.', 5),
('Taller de Matemáticas', '2025-10-20 23:59:00', 'Resolver ejercicios de integración por fracciones parciales (mínimo 10).', 1),
('Investigación en Inteligencia Artificial', '2025-10-25 23:59:00', 'Preparar un informe sobre el impacto de la IA en la educación.', 3);


ALTER TABLE entregas ADD COLUMN curso_id INT NOT NULL;

ALTER TABLE entregas 
ADD CONSTRAINT fk_entregas_cursos 
FOREIGN KEY (curso_id) REFERENCES cursos(id_curso);
INSERT INTO entregas (id_usuario, nombre_tarea, nombre_archivo, ruta_archivo, fecha_entrega, calificacion, curso_id)
VALUES
(1, 'Trabajo Práctico 1 - Programación', 'tp1.pdf', '/uploads/tp1.pdf', '2025-09-15 14:30:00', 4.5, 1),
(2, 'Ensayo de Historia', 'ensayo.docx', '/uploads/ensayo.docx', '2025-09-16 10:00:00', 3.8, 2),
(3, 'Proyecto de Base de Datos', 'modeloER.png', '/uploads/modeloER.png', '2025-09-17 09:45:00', NULL, 3),
(4, 'Exposición de Física', 'exposicion.pptx', '/uploads/exposicion.pptx', '2025-09-18 11:20:00', 5.0, 1),
(5, 'Práctica de Inglés', 'audio.mp3', '/uploads/audio.mp3', '2025-09-19 08:10:00', NULL, 2);

INSERT INTO entregas (id_usuario, nombre_tarea, nombre_archivo, ruta_archivo, fecha_entrega, calificacion, curso_id)
VALUES
(1, 'Trabajo Práctico 1 - Programación', 'tp1.pdf', '/uploads/tp1.pdf', '2025-09-15 14:30:00', 4.5, 1),
(2, 'Ensayo de Historia', 'ensayo.docx', '/uploads/ensayo.docx', '2025-09-16 10:00:00', 3.8, 2),
(3, 'Proyecto de Base de Datos', 'modeloER.png', '/uploads/modeloER.png', '2025-09-17 09:45:00', NULL, 3),
(4, 'Exposición de Física', 'exposicion.pptx', '/uploads/exposicion.pptx', '2025-09-18 11:20:00', 5.0, 1),
(5, 'Práctica de Inglés', 'audio.mp3', '/uploads/audio.mp3', '2025-09-19 08:10:00', NULL, 2),
(6, 'Informe de Química', 'informe_quimica.pdf', '/uploads/informe_quimica.pdf', '2025-09-20 16:00:00', 4.2, 3),
(7, 'Mapa Conceptual de Biología', 'mapa_bio.jpg', '/uploads/mapa_bio.jpg', '2025-09-21 09:30:00', 4.8, 2),
(8, 'Tarea de Matemáticas', 'ejercicios_mate.xlsx', '/uploads/ejercicios_mate.xlsx', '2025-09-21 18:15:00', 3.5, 1),
(9, 'Resumen de Literatura', 'resumen_lit.docx', '/uploads/resumen_lit.docx', '2025-09-22 12:45:00', NULL, 2),
(10, 'Simulación de Redes', 'simulacion.cisco', '/uploads/simulacion.cisco', '2025-09-22 20:50:00', 4.9, 3);

INSERT INTO foro (titulo, descripcion, autor_id) VALUES
('Introducción a Java', 'Discute dudas, comparte tips y ejemplos de programación en Java.', 1),
('Matemáticas Discretas', 'Comparte ejercicios y resuelve dudas sobre lógica, conjuntos y grafos.', 2),
('Proyecto Final de Sistemas', 'Espacio para hablar sobre los avances, problemas y soluciones del proyecto final.', 3),
('Bases de Datos', 'Preguntas sobre SQL, modelado de datos y consultas complejas.', 1),
('Inteligencia Artificial', 'Comparte noticias, proyectos y dudas sobre Machine Learning y AI.', 4),
('Algoritmos y Estructuras de Datos', 'Foro para analizar la complejidad de algoritmos y estructuras de datos.', 2);
DESCRIBE foro;


INSERT INTO comentarios_foro (contenido, id_usuario, id_foro) VALUES
('¡Este foro es muy interesante!', 1, 1),
('Estoy de acuerdo con lo que se dijo en el post.', 2, 1),
('Tengo una duda sobre el tema tratado.', 3, 2),
('Excelente explicación, gracias por compartir.', 1, 2),
('Podrían agregar más ejemplos prácticos?', 2, 1);
use aulanote2;
INSERT INTO entregas (id_usuario, curso_id, nombre_tarea, nombre_archivo, ruta_archivo, fecha_entrega, calificacion) VALUES
-- 📘 Matemáticas I (id_curso = 1)
(4, 1, 'Ejercicios de Álgebra', 'algebra1.pdf', '/uploads/matematicas/algebra1.pdf', NOW() - INTERVAL 5 DAY, 85.50),
(5, 1, 'Funciones y Gráficas', 'funciones.pdf', '/uploads/matematicas/funciones.pdf', NOW() - INTERVAL 4 DAY, 92.00),
(6, 1, 'Taller de Trigonometría', 'trigonometria.docx', '/uploads/matematicas/trigonometria.docx', NOW() - INTERVAL 3 DAY, NULL),

-- 🌍 Historia Universal (id_curso = 2)
(4, 2, 'Civilizaciones Antiguas', 'civilizaciones.pdf', '/uploads/historia/civilizaciones.pdf', NOW() - INTERVAL 6 DAY, 88.00),
(5, 2, 'Revolución Francesa', 'revolucion.pdf', '/uploads/historia/revolucion.pdf', NOW() - INTERVAL 2 DAY, NULL),
(6, 2, 'Primera Guerra Mundial', 'guerra_mundial.docx', '/uploads/historia/guerra_mundial.docx', NOW() - INTERVAL 1 DAY, 90.00),

-- 💻 Programación en Java (id_curso = 3)
(4, 3, 'Clases y Objetos', 'clases_objetos.zip', '/uploads/java/clases_objetos.zip', NOW() - INTERVAL 7 DAY, 95.00),
(5, 3, 'Herencia y Polimorfismo', 'herencia.pdf', '/uploads/java/herencia.pdf', NOW() - INTERVAL 4 DAY, 87.00),
(6, 3, 'Proyecto Final POO', 'proyecto_final.zip', '/uploads/java/proyecto_final.zip', NOW() - INTERVAL 1 DAY, NULL),

-- ⚙️ Física General (id_curso = 4)
(4, 4, 'Leyes de Newton', 'leyes_newton.pdf', '/uploads/fisica/leyes_newton.pdf', NOW() - INTERVAL 5 DAY, 78.50),
(5, 4, 'Trabajo y Energía', 'energia.docx', '/uploads/fisica/energia.docx', NOW() - INTERVAL 2 DAY, NULL),
(6, 4, 'Movimiento Circular', 'mov_circular.pdf', '/uploads/fisica/mov_circular.pdf', NOW() - INTERVAL 3 DAY, 82.00),

-- 🗄️ Bases de Datos (id_curso = 5)
(4, 5, 'Consultas SQL Básicas', 'consultas.sql', '/uploads/bd/consultas.sql', NOW() - INTERVAL 4 DAY, 100.00),
(5, 5, 'Normalización', 'normalizacion.pdf', '/uploads/bd/normalizacion.pdf', NOW() - INTERVAL 3 DAY, 90.50),
(6, 5, 'Modelo Entidad-Relación', 'mer.png', '/uploads/bd/mer.png', NOW() - INTERVAL 2 DAY, NULL);



SELECT 
    TABLE_NAME, 
    COLUMN_NAME, 
    CONSTRAINT_NAME, 
    REFERENCED_TABLE_NAME, 
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_NAME = 'usuario';


