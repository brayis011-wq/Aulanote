package com.proyecto.spring.aulanote.aulanote.controller;

import java.io.File;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.proyecto.spring.aulanote.aulanote.entity.Entrega;
import com.proyecto.spring.aulanote.aulanote.dto.EntregaDTO;
import com.proyecto.spring.aulanote.aulanote.entity.Curso;
import com.proyecto.spring.aulanote.aulanote.repository.EntregaRepository;
import com.proyecto.spring.aulanote.aulanote.repository.CursoRepository;
import com.proyecto.spring.aulanote.aulanote.service.EntregaService;

@RestController
@RequestMapping("/api/entregas")
@CrossOrigin(origins = "*")
public class EntregaController {

    @Autowired
    private EntregaService entregaService;

    @Autowired
    private EntregaRepository entregaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    // ✅ Listar todas las entregas
    @GetMapping
    public ResponseEntity<List<Entrega>> listarEntregas() {
        return new ResponseEntity<>(entregaService.listarEntregas(), HttpStatus.OK);
    }

// ✅ Listar tareas de un curso específico (en formato DTO)
@GetMapping("/curso/{idCurso}/tareas")
public ResponseEntity<?> getTareasPorCurso(@PathVariable Integer idCurso) {
    try {
        List<EntregaDTO> entregasDTO = entregaService.obtenerEntregasDTOPorCurso(idCurso);
        
        // ✅ Siempre devolver una lista (aunque esté vacía)
        return ResponseEntity.ok(entregasDTO);

    } catch (Exception e) {
        e.printStackTrace();
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Error al cargar calificaciones");
        error.put("mensaje", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}



    // ✅ Obtener promedios por usuario
    @GetMapping("/promedios/usuario/{idUsuario}")
    public List<Map<String, Object>> getPromediosPorUsuario(@PathVariable Integer idUsuario) {
        List<Object[]> resultados = entregaRepository.obtenerPromedioPorUsuario(idUsuario);
        List<Map<String, Object>> respuesta = new ArrayList<>();

        for (Object[] fila : resultados) {
            Map<String, Object> map = new HashMap<>();
            map.put("idCurso", fila[0]);
            map.put("curso", fila[1]);
            map.put("promedio", fila[2]);
            respuesta.add(map);
        }
        return respuesta;
    }

    // ✅ Obtener promedios por curso
    @GetMapping("/promedios")
    public List<Map<String, Object>> getPromediosPorCurso() {
        List<Object[]> resultados = entregaRepository.obtenerPromedioPorCurso();
        List<Map<String, Object>> respuesta = new ArrayList<>();

        for (Object[] fila : resultados) {
            Map<String, Object> map = new HashMap<>();
            map.put("idCurso", fila[0]);
            map.put("curso", fila[1]);
            map.put("promedio", fila[2]);
            respuesta.add(map);
        }
        return respuesta;
    }

    // ✅ Subir entrega (PDF)
    @PostMapping("/curso/{idCurso}/subir")
    public ResponseEntity<String> subirEntrega(
            @PathVariable Integer idCurso,
            @RequestParam("nombreTarea") String nombreTarea,
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("idUsuario") Integer idUsuario) {

        try {
            if (archivo.isEmpty()) {
                return ResponseEntity.badRequest().body("❌ Archivo vacío");
            }

            if (!"application/pdf".equals(archivo.getContentType())) {
                return ResponseEntity.badRequest().body("❌ Solo se permiten archivos PDF");
            }

            Optional<Curso> cursoOpt = cursoRepository.findById(idCurso);
            if (cursoOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("❌ El curso no existe");
            }

            // ✅ Carpeta uploads en raíz del proyecto
            String carpetaUploads = System.getProperty("user.dir") + File.separator + "uploads";
            File directorio = new File(carpetaUploads);
            if (!directorio.exists()) {
                directorio.mkdirs();
            }

            // ✅ Nombre único
            String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
            Path path = Paths.get(carpetaUploads, nombreArchivo);
            archivo.transferTo(path.toFile());

            // ✅ Guardamos solo el nombre del archivo
            Entrega entrega = new Entrega();
            entrega.setNombreTarea(nombreTarea);
            entrega.setNombreArchivo(nombreArchivo);
            entrega.setRutaArchivo(nombreArchivo);
            entrega.setFechaEntrega(java.time.LocalDateTime.now());
            entrega.setCalificacion(null);
            entrega.setIdUsuario(idUsuario);
            entrega.setCurso(cursoOpt.get());

            entregaService.crearEntrega(entrega);

            return ResponseEntity.ok("✅ Entrega subida correctamente");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error al subir la entrega: " + e.getMessage());
        }
    }

    // ✅ Descargar o visualizar PDF (por nombre)
    @GetMapping("/ver/{nombreArchivo}")
    public ResponseEntity<?> verArchivo(@PathVariable String nombreArchivo) {
        try {
            String carpetaUploads = System.getProperty("user.dir") + File.separator + "uploads";
            Path path = Paths.get(carpetaUploads).resolve(nombreArchivo);

            if (!Files.exists(path)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Archivo no encontrado");
            }

            Resource resource = new UrlResource(path.toUri());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + nombreArchivo + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error al mostrar el archivo");
        }
    }

    // ✅ Descargar o visualizar PDF (por ID)
    @GetMapping("/descargar/{id}")
    public ResponseEntity<?> descargarArchivo(@PathVariable Integer id) {
        try {
            Optional<Entrega> entregaOpt = entregaService.obtenerEntregaPorId(id);
            if (entregaOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Entrega no encontrada");
            }

            Entrega entrega = entregaOpt.get();
            String carpetaUploads = System.getProperty("user.dir") + File.separator + "uploads";
            Path path = Paths.get(carpetaUploads).resolve(entrega.getRutaArchivo());

            if (!Files.exists(path)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Archivo no encontrado");
            }

            Resource resource = new UrlResource(path.toUri());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + entrega.getNombreArchivo() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error al descargar el archivo");
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

// ✅ Calificar entrega (versión segura)
@PutMapping("/calificar/{id}")
public ResponseEntity<?> calificarEntrega(@PathVariable Integer id, @RequestParam BigDecimal calificacion) {
    try {
        // Validar calificación 0-5
        if (calificacion == null) {
            return ResponseEntity.badRequest().body("⚠️ La calificación no puede estar vacía");
        }
        if (calificacion.compareTo(BigDecimal.ZERO) < 0 || calificacion.compareTo(new BigDecimal(5)) > 0) {
            return ResponseEntity.badRequest().body("⚠️ La calificación debe estar entre 0 y 5");
        }

        Optional<Entrega> entregaCalificada = entregaService.calificarEntrega(id, calificacion);

        if (entregaCalificada.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Entrega no encontrada");
        }

        return ResponseEntity.ok(entregaCalificada.get());

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("❌ Error interno al calificar la entrega: " + e.getMessage());
    }
}



    // ✅ Editar entrega (nombre y/o archivo PDF)
    @PutMapping("/{idEntrega}/editar")
    public ResponseEntity<String> editarEntrega(
            @PathVariable Integer idEntrega,
            @RequestParam("nombreTarea") String nombreTarea,
            @RequestParam(value = "archivo", required = false) MultipartFile archivo) {
        try {
            String mensaje = entregaService.editarEntrega(idEntrega, nombreTarea, archivo);
            return ResponseEntity.ok(mensaje);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error al editar la entrega: " + e.getMessage());
        }
    }

    // ✅ Eliminar entrega físicamente (BD + archivo)
    @DeleteMapping("/{idEntrega}/eliminar")
    public ResponseEntity<String> eliminarEntregaFisicamente(@PathVariable Integer idEntrega) {
        try {
            boolean eliminado = entregaService.eliminarEntregaFisicamente(idEntrega);
            if (eliminado) {
                return ResponseEntity.ok("✅ Entrega eliminada correctamente");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("❌ No se encontró la entrega para eliminar");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error al eliminar entrega: " + e.getMessage());
        }
    }
}

