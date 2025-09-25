package com.proyecto.spring.aulanote.aulanote.controller;

import com.proyecto.spring.aulanote.aulanote.entity.ComentarioForo;
import com.proyecto.spring.aulanote.aulanote.service.ComentarioForoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
//hola
@RestController
@RequestMapping("/api/comentarios")
public class ComentarioForoController {

    @Autowired
    private ComentarioForoService comentarioService;

    // Listar comentarios de un foro
    @GetMapping("/foro/{foroId}")
    public ResponseEntity<List<ComentarioForo>> listarPorForo(@PathVariable Integer foroId) {
        List<ComentarioForo> comentarios = comentarioService.listarPorForo(foroId);
        if (comentarios.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(comentarios);
    }

    // Crear comentario
 // Comentar en un foro (forma simplificada)
    @PostMapping("/foro/{foroId}/usuario/{usuarioId}")
    public ResponseEntity<ComentarioForo> comentarEnForo(
        @PathVariable Integer foroId,
        @PathVariable Integer usuarioId,
        @RequestBody String contenido) {
    try {
        ComentarioForo nuevo = comentarioService.comentarForo(foroId, usuarioId, contenido);
        return ResponseEntity.ok(nuevo);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().build();
    }
}


    // Eliminar comentario
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarComentario(@PathVariable Integer id) {
        boolean eliminado = comentarioService.eliminar(id);
        return eliminado ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
