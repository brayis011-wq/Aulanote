package com.proyecto.spring.aulanote.aulanote.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto.spring.aulanote.aulanote.entity.Inscripcion;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.service.InscripcionService;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    @Autowired
    private InscripcionService inscripcionService;

    // 🔹 Estudiantes de un curso
    @GetMapping("/curso/{cursoId}/estudiantes")
    public ResponseEntity<List<Usuario>> listarEstudiantesPorCurso(@PathVariable int cursoId) {
        List<Usuario> estudiantes = inscripcionService.listarEstudiantesPorCurso(cursoId);
        return ResponseEntity.ok(estudiantes);
    }

    // CRUD normal de inscripciones
    @GetMapping
    public List<Inscripcion> listarInscripciones() {
        return inscripcionService.listarInscripciones();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> obtenerInscripcionPorId(@PathVariable Integer id) {
        Optional<Inscripcion> inscripcion = inscripcionService.obtenerInscripcionPorId(id);
        return inscripcion.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Inscripcion> crearInscripcion(@RequestBody Inscripcion inscripcion) {
        return ResponseEntity.ok(inscripcionService.crearInscripcion(inscripcion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inscripcion> actualizarInscripcion(@PathVariable Integer id, @RequestBody Inscripcion inscripcionDetalles) {
        return inscripcionService.actualizarInscripcion(id, inscripcionDetalles)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInscripcion(@PathVariable Integer id) {
        return inscripcionService.eliminarInscripcion(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
