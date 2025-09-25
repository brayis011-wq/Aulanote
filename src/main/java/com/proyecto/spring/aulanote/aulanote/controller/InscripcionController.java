package com.proyecto.spring.aulanote.aulanote.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto.spring.aulanote.aulanote.entity.Inscripcion;
import com.proyecto.spring.aulanote.aulanote.service.InscripcionService;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    @Autowired
    private InscripcionService inscripcionService;

    @GetMapping
    public ResponseEntity<List<Inscripcion>> listarInscripciones() {
        List<Inscripcion> inscripciones = inscripcionService.listarInscripciones();
        return new ResponseEntity<>(inscripciones, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> obtenerInscripcion(@PathVariable Integer id) {
        Optional<Inscripcion> inscripcion = inscripcionService.obtenerInscripcionPorId(id);
        return inscripcion.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                          .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Inscripcion> crearInscripcion(@RequestBody Inscripcion inscripcion) {
        Inscripcion nuevaInscripcion = inscripcionService.crearInscripcion(inscripcion);
        return new ResponseEntity<>(nuevaInscripcion, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inscripcion> actualizarInscripcion(
            @PathVariable Integer id,
            @RequestBody Inscripcion inscripcionDetalles) {
        return inscripcionService.actualizarInscripcion(id, inscripcionDetalles)
                .map(actualizada -> new ResponseEntity<>(actualizada, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInscripcion(@PathVariable Integer id) {
        Boolean eliminado = inscripcionService.eliminarInscripcion(id);
        return eliminado ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                         : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
