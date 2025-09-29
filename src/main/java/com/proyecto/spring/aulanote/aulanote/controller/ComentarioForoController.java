package com.proyecto.spring.aulanote.aulanote.controller;

import com.proyecto.spring.aulanote.aulanote.dto.ComentarioForoDTO;
import com.proyecto.spring.aulanote.aulanote.entity.ComentarioForo;
import com.proyecto.spring.aulanote.aulanote.service.ComentarioForoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "*") // 🔹 Permitir llamadas desde el frontend
public class ComentarioForoController {

    @Autowired
    private ComentarioForoService comentarioService;

    // 🔹 Listar comentarios de un foro
    @GetMapping("/foro/{foroId}")
    public ResponseEntity<List<ComentarioForoDTO>> listarPorForo(@PathVariable Integer foroId) {
        List<ComentarioForoDTO> comentarios = comentarioService.listarPorForo(foroId);
        if (comentarios.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(comentarios);
    }

    // 🔹 Crear comentario
    @PostMapping("/foro/{foroId}/usuario/{usuarioId}")
    public ResponseEntity<ComentarioForoDTO> comentarEnForo(
            @PathVariable Integer foroId,
            @PathVariable Integer usuarioId,
            @RequestBody String contenido) {
        try {
            ComentarioForoDTO nuevo = comentarioService.comentarForo(foroId, usuarioId, contenido);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    // 🔹 Editar comentario (solo si el comentario pertenece al usuario)
    @PutMapping("/editar/{id}/{usuarioId}")
    public ResponseEntity<ComentarioForo> editarComentario(
            @PathVariable Integer id,
            @PathVariable Integer usuarioId,
            @RequestBody ComentarioForo dto) {

        return comentarioService.editar(id, usuarioId, dto.getContenido())
                .map(updated -> new ResponseEntity<>(updated, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.FORBIDDEN));
    }

    // 🔹 Eliminar comentario
    // ✅ El usuario puede eliminar su propio comentario
    // ✅ Un administrador/profesor puede eliminar cualquier comentario
    @DeleteMapping("/eliminar/{id}/{usuarioId}")
    public ResponseEntity<Void> eliminarComentario(
            @PathVariable Integer id,
            @PathVariable Integer usuarioId) {

        if (comentarioService.eliminar(id, usuarioId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN); // 🔒 No tiene permisos
    }
}
