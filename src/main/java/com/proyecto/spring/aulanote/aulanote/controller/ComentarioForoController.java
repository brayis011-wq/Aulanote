package com.proyecto.spring.aulanote.aulanote.controller;

import com.proyecto.spring.aulanote.aulanote.dto.ComentarioForoDTO;
import com.proyecto.spring.aulanote.aulanote.dto.NuevoComentarioDTO;
import com.proyecto.spring.aulanote.aulanote.entity.ComentarioForo;
import com.proyecto.spring.aulanote.aulanote.service.ComentarioForoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/comentarios")
public class ComentarioForoController {

    @Autowired
    private ComentarioForoService comentarioService;

    // 🔹 1. Listar comentarios de un foro
    @GetMapping("/foro/{foroId}")
    public ResponseEntity<List<ComentarioForoDTO>> listarPorForo(@PathVariable Integer foroId) {
        return ResponseEntity.ok(comentarioService.listarPorForo(foroId));
    }

    // 🔹 2. Crear comentario en un foro
    @PostMapping("/foro/{foroId}/usuario/{usuarioId}")
    public ResponseEntity<ComentarioForoDTO> comentar(
            @PathVariable Integer foroId,
            @PathVariable Integer usuarioId,
            @RequestBody NuevoComentarioDTO nuevoComentario
    ) {
        ComentarioForoDTO comentario = comentarioService.comentarForo(foroId, usuarioId, nuevoComentario.getContenido());
        return ResponseEntity.ok(comentario);
    }

    // 🔹 3. Editar comentario (solo dueño)
    @PutMapping("/{idComentario}/usuario/{usuarioId}")
    public ResponseEntity<?> editar(
            @PathVariable Integer idComentario,
            @PathVariable Integer usuarioId,
            @RequestBody NuevoComentarioDTO nuevoContenido
    ) {
        Optional<ComentarioForo> actualizado = comentarioService.editar(idComentario, usuarioId, nuevoContenido.getContenido());
        if (actualizado.isPresent()) {
            return ResponseEntity.ok("Comentario actualizado con éxito ✅");
        } else {
            return ResponseEntity.status(403).body("No tienes permisos para editar este comentario ❌");
        }
    }

    // 🔹 4. Eliminar comentario (dueño o profesor/admin)
    @DeleteMapping("/{idComentario}/usuario/{usuarioId}")
    public ResponseEntity<?> eliminar(
            @PathVariable Integer idComentario,
            @PathVariable Integer usuarioId
    ) {
        boolean eliminado = comentarioService.eliminar(idComentario, usuarioId);
        if (eliminado) {
            return ResponseEntity.ok("Comentario eliminado con éxito 🗑️");
        } else {
            return ResponseEntity.status(403).body("No tienes permisos para eliminar este comentario ❌");
        }
    }
}
