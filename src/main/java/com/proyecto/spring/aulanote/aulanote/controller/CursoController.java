package com.proyecto.spring.aulanote.aulanote.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto.spring.aulanote.aulanote.entity.Curso;
import com.proyecto.spring.aulanote.aulanote.service.CursoService;

@RestController
@RequestMapping("/api/curso")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @GetMapping
    public ResponseEntity<List<Curso>> listarCursos() {
        List<Curso> cursos = cursoService.listarCursos();
        return new ResponseEntity<>(cursos, HttpStatus.OK);
    }

    @GetMapping("/buscar/{id}")
    public ResponseEntity<Curso> buscarCurso(@PathVariable int id) {
        Optional<Curso> curso = cursoService.obtenerCursoPorId(id);
        return curso.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/crear")
    public ResponseEntity<Curso> crearCurso(@RequestBody Curso curso) {
        Curso nuevoCurso = cursoService.crearCurso(curso);
        return new ResponseEntity<>(nuevoCurso, HttpStatus.CREATED);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Curso> actualizarCurso(@PathVariable int id, @RequestBody Curso cursoDetalles) {
        return cursoService.actualizarCurso(id, cursoDetalles)
                .map(updatedCurso -> new ResponseEntity<>(updatedCurso, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarCurso(@PathVariable int id) {
        Boolean eliminado = cursoService.eliminarCurso(id);
        if (eliminado) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/profesor/{id}")
    public ResponseEntity<List<Curso>> listarCursosPorProfesor(@PathVariable int id) {
        List<Curso> cursos = cursoService.listarCursosPorProfesorId(id);
        return new ResponseEntity<>(cursos, HttpStatus.OK);
    }

}
