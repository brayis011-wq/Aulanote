package com.proyecto.spring.aulanote.aulanote.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proyecto.spring.aulanote.aulanote.entity.Tareas;
import com.proyecto.spring.aulanote.aulanote.service.TareasService;

@RestController
@RequestMapping("/api/tareas")
public class TareasController {

    @Autowired
    private TareasService tareasService;

    @GetMapping
    public ResponseEntity<List<Tareas>> listarTareas() {
        return new ResponseEntity<>(tareasService.listarTareas(), HttpStatus.OK);
    }
    

    @GetMapping("/buscar/{id}")
    public ResponseEntity<Tareas> buscarTarea(@PathVariable Integer id) {
        Optional<Tareas> tarea = tareasService.obtenerTareaPorId(id);
        return tarea.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/crear")
    public ResponseEntity<Tareas> crearTarea(@RequestBody Tareas tarea) {
        return new ResponseEntity<>(tareasService.crearTarea(tarea), HttpStatus.CREATED);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Tareas> actualizarTarea(@PathVariable Integer id, @RequestBody Tareas tareaDetalles) {
        return tareasService.actualizarTarea(id, tareaDetalles)
                .map(updatedTarea -> new ResponseEntity<>(updatedTarea, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Integer id) {
        if (tareasService.eliminarTarea(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // --- Método personalizado ---
    @PutMapping("/calificar/{id}")
    public ResponseEntity<Tareas> calificarTarea(@PathVariable Integer id, @RequestParam String calificacion) {
        return tareasService.calificarTarea(id, calificacion)
                .map(tareaCalificada -> new ResponseEntity<>(tareaCalificada, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
