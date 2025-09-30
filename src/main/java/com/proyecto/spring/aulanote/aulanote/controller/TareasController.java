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

    @GetMapping("/profesor/{profesorId}")
    public ResponseEntity<List<Tareas>> listarTareasPorProfesor(@PathVariable Integer profesorId) {
        return new ResponseEntity<>(tareasService.listarPorProfesor(profesorId), HttpStatus.OK);
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<Tareas>> listarTareasPorCurso(@PathVariable Integer cursoId) {
        return new ResponseEntity<>(tareasService.listarPorCurso(cursoId), HttpStatus.OK);
    }

    @GetMapping("/profesor/{profesorId}/curso/{cursoId}")
    public ResponseEntity<List<Tareas>> listarTareasPorProfesorYCurso(
            @PathVariable Integer profesorId,
            @PathVariable Integer cursoId) {
        return new ResponseEntity<>(tareasService.listarPorProfesorYCurso(profesorId, cursoId), HttpStatus.OK);
    }

    @PostMapping("/crear")
    public ResponseEntity<Tareas> crearTarea(@RequestBody Tareas tarea) {
        return new ResponseEntity<>(tareasService.crearTarea(tarea), HttpStatus.CREATED);
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Tareas> actualizarTarea(
            @PathVariable Integer id,
            @RequestBody Tareas tareaDetalles) {

        if (tareaDetalles.getProfesorId() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return tareasService.actualizarTarea(id, tareaDetalles, tareaDetalles.getProfesorId())
                .map(updatedTarea -> new ResponseEntity<>(updatedTarea, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/eliminar/{id}/{profesorId}")
    public ResponseEntity<Void> eliminarTarea(
            @PathVariable Integer id,
            @PathVariable Integer profesorId) {

        if (tareasService.eliminarTarea(id, profesorId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }



}
