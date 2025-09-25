package com.proyecto.spring.aulanote.aulanote.controller;

import java.math.BigDecimal;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.proyecto.spring.aulanote.aulanote.entity.Entrega;
import com.proyecto.spring.aulanote.aulanote.repository.EntregaRepository;
import com.proyecto.spring.aulanote.aulanote.service.EntregaService;

@RestController
@RequestMapping("/api/entregas")
public class EntregaController {

    @Autowired
    private EntregaService entregaService;

    @Autowired
    private EntregaRepository entregaRepository; // ✅ inyección del repositorio

    // ✅ Listar todas las entregas
    @GetMapping
    public ResponseEntity<List<Entrega>> listarEntregas() {
        return new ResponseEntity<>(entregaService.listarEntregas(), HttpStatus.OK);
    }

    // ✅ Listar tareas de un curso específico
    @GetMapping("/curso/{idCurso}/tareas")
    public List<Entrega> getTareasPorCurso(@PathVariable Integer idCurso) {
        return entregaService.obtenerEntregasPorCurso(idCurso);
    }
    @GetMapping("/promedios/usuario/{idUsuario}")
    public List<Map<String, Object>> getPromediosPorUsuario(@PathVariable Integer idUsuario) {
    List<Object[]> resultados = entregaRepository.obtenerPromedioPorUsuario(idUsuario);
    List<Map<String, Object>> respuesta = new ArrayList<>();

    for (Object[] fila : resultados) {
        Map<String, Object> map = new HashMap<>();
        map.put("idCurso", fila[0]);   // id del curso
        map.put("curso", fila[1]);     // nombre del curso
        map.put("promedio", fila[2]);  // promedio de calificaciones
        respuesta.add(map);
    }

    return respuesta;
}

    // ✅ Obtener promedios por curso (con idCurso incluido)
    @GetMapping("/promedios")
    public List<Map<String, Object>> getPromediosPorCurso() {
        List<Object[]> resultados = entregaRepository.obtenerPromedioPorCurso();
        List<Map<String, Object>> respuesta = new ArrayList<>();

        for (Object[] fila : resultados) {
            Map<String, Object> map = new HashMap<>();
            map.put("idCurso", fila[0]);   // id del curso
            map.put("curso", fila[1]);     // nombre del curso
            map.put("promedio", fila[2]);  // promedio de calificaciones
            respuesta.add(map);
        }

        return respuesta;
    }

    @PostMapping("/curso/{idCurso}/subir")
public ResponseEntity<String> subirEntrega(
        @PathVariable Integer idCurso,
        @RequestParam("nombreTarea") String nombreTarea,
        @RequestParam("archivo") MultipartFile archivo,
        @RequestParam("idUsuario") Integer idUsuario) {

    try {
        // Validar archivo
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().body("Archivo vacío");
        }

        // Guardar archivo en carpeta local (ejemplo "uploads/")
        String ruta = "uploads/" + archivo.getOriginalFilename();
        java.nio.file.Path path = java.nio.file.Paths.get(ruta);
        java.nio.file.Files.createDirectories(path.getParent());
        archivo.transferTo(path.toFile());

        // Crear entidad Entrega
        Entrega entrega = new Entrega();
        entrega.setNombreTarea(nombreTarea);
        entrega.setNombreArchivo(archivo.getOriginalFilename());
        entrega.setRutaArchivo(ruta);
        entrega.setFechaEntrega(java.time.LocalDateTime.now());
        entrega.setCalificacion(null);
        entrega.setIdUsuario(idUsuario);

        // Relación con Curso
        com.proyecto.spring.aulanote.aulanote.entity.Curso curso = new com.proyecto.spring.aulanote.aulanote.entity.Curso();
        curso.setIdCurso(idCurso);
        entrega.setCurso(curso);

        entregaService.crearEntrega(entrega);

        return ResponseEntity.ok("Entrega subida correctamente");

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("Error al subir la entrega");
    }
}


    // ✅ Buscar entrega por ID
    @GetMapping("/buscar/{id}")
    public ResponseEntity<Entrega> buscarEntrega(@PathVariable Integer id) {
        Optional<Entrega> entrega = entregaService.obtenerEntregaPorId(id);
        return entrega.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                      .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // ✅ Crear entrega
    @PostMapping("/crear")
    public ResponseEntity<Entrega> crearEntrega(@RequestBody Entrega entrega) {
        return new ResponseEntity<>(entregaService.crearEntrega(entrega), HttpStatus.CREATED);
    }

    // ✅ Actualizar entrega
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Entrega> actualizarEntrega(@PathVariable Integer id, @RequestBody Entrega entregaDetalles) {
        return entregaService.actualizarEntrega(id, entregaDetalles)
                .map(updatedEntrega -> new ResponseEntity<>(updatedEntrega, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // ✅ Eliminar entrega
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarEntrega(@PathVariable Integer id) {
        if (entregaService.eliminarEntrega(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // ✅ Calificar entrega
    @PutMapping("/calificar/{id}")
    public ResponseEntity<Entrega> calificarEntrega(@PathVariable Integer id, @RequestParam BigDecimal calificacion) {
        return entregaService.calificarEntrega(id, calificacion)
                .map(entregaCalificada -> new ResponseEntity<>(entregaCalificada, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
