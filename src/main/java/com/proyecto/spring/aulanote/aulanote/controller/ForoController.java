package com.proyecto.spring.aulanote.aulanote.controller;

import com.proyecto.spring.aulanote.aulanote.entity.Foro;
import com.proyecto.spring.aulanote.aulanote.service.ForoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/foros")
@CrossOrigin(origins = "*") 
public class ForoController {

    @Autowired
    private ForoService foroService;

    // 🔹 Listar todos los foros
    @GetMapping
    public List<Foro> listarForos() {
        return foroService.listarForos();
    }

    // 🔹 Crear un nuevo foro
    @PostMapping("/crear")
    public ResponseEntity<Foro> crearForo(@RequestBody Foro foro) {
        Foro nuevoForo = foroService.crearForo(foro);
        return ResponseEntity.ok(nuevoForo);
    }

    // 🔹 Obtener foro por ID
    @GetMapping("/{id}")
    public ResponseEntity<Foro> obtenerForo(@PathVariable Integer id) {
        Optional<Foro> foro = foroService.obtenerForoPorId(id);
        return foro.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Actualizar foro
    @PutMapping("/{id}")
    public ResponseEntity<Foro> actualizarForo(@PathVariable Integer id, @RequestBody Foro foroDetalles) {
        Optional<Foro> foroActualizado = foroService.actualizarForo(id, foroDetalles);
        return foroActualizado.map(ResponseEntity::ok)
                              .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Eliminar foro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarForo(@PathVariable Integer id) {
        if (foroService.eliminarForo(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
