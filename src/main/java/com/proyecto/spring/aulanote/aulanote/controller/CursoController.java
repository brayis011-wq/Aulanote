package com.proyecto.spring.aulanote.aulanote.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto.spring.aulanote.aulanote.dto.CursoDTO;
import com.proyecto.spring.aulanote.aulanote.entity.Curso;
import com.proyecto.spring.aulanote.aulanote.service.CursoService;

@RestController
@RequestMapping("/api/curso")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    // 🔹 Listar todos los cursos (en DTO)
    @GetMapping
    public ResponseEntity<List<CursoDTO>> listarCursos() {
        List<Curso> cursos = cursoService.listarCursos();
        List<CursoDTO> cursosDTO = cursos.stream()
                .map(c -> new CursoDTO(
                        c.getIdCurso(),
                        c.getNombre(),
                        c.getDescripcion(),
                        c.getFechaCreacion(),
                        c.getProfesor().getNombre() + " " + c.getProfesor().getApellido()
                ))
                .collect(Collectors.toList());

        return new ResponseEntity<>(cursosDTO, HttpStatus.OK);
    }

    // 🔹 Buscar curso por ID (en DTO)
    @GetMapping("/buscar/{id}")
    public ResponseEntity<CursoDTO> buscarCurso(@PathVariable int id) {
        Optional<Curso> curso = cursoService.obtenerCursoPorId(id);
        return curso.map(c -> new ResponseEntity<>(new CursoDTO(
                c.getIdCurso(),
                c.getNombre(),
                c.getDescripcion(),
                c.getFechaCreacion(),
                c.getProfesor().getNombre() + " " + c.getProfesor().getApellido()
        ), HttpStatus.OK))
        .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 🔹 Crear curso (se devuelve en DTO)
    @PostMapping("/crear")
    public ResponseEntity<CursoDTO> crearCurso(@RequestBody Curso curso) {
        Curso nuevoCurso = cursoService.crearCurso(curso);
        CursoDTO dto = new CursoDTO(
                nuevoCurso.getIdCurso(),
                nuevoCurso.getNombre(),
                nuevoCurso.getDescripcion(),
                nuevoCurso.getFechaCreacion(),
                nuevoCurso.getProfesor().getNombre() + " " + nuevoCurso.getProfesor().getApellido()
        );
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    // 🔹 Actualizar curso
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<CursoDTO> actualizarCurso(@PathVariable int id, @RequestBody Curso cursoDetalles) {
        return cursoService.actualizarCurso(id, cursoDetalles)
                .map(updated -> new ResponseEntity<>(new CursoDTO(
                        updated.getIdCurso(),
                        updated.getNombre(),
                        updated.getDescripcion(),
                        updated.getFechaCreacion(),
                        updated.getProfesor().getNombre() + " " + updated.getProfesor().getApellido()
                ), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 🔹 Eliminar curso
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarCurso(@PathVariable int id) {
        Boolean eliminado = cursoService.eliminarCurso(id);
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 🔹 Listar cursos de un profesor específico (en DTO)
    @GetMapping("/profesor/{id}")
    public ResponseEntity<List<CursoDTO>> listarCursosPorProfesor(@PathVariable int id) {
        List<Curso> cursos = cursoService.listarCursosPorProfesorId(id);
        List<CursoDTO> cursosDTO = cursos.stream()
                .map(c -> new CursoDTO(
                        c.getIdCurso(),
                        c.getNombre(),
                        c.getDescripcion(),
                        c.getFechaCreacion(),
                        c.getProfesor().getNombre() + " " + c.getProfesor().getApellido()
                ))
                .collect(Collectors.toList());

        return new ResponseEntity<>(cursosDTO, HttpStatus.OK);
    }
}
