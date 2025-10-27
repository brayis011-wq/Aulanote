package com.proyecto.spring.aulanote.aulanote.controller;

import com.proyecto.spring.aulanote.aulanote.dto.ComentarioForoDTO;
import com.proyecto.spring.aulanote.aulanote.entity.ComentarioForo;
import com.proyecto.spring.aulanote.aulanote.service.ComentarioForoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "http://localhost:3000") // ✅ Ajusta al puerto de tu frontend (5500 si usas Live Server)
public class ComentarioForoController {

    @Autowired
    private ComentarioForoService comentarioService;

    // 🔹 1. Listar comentarios principales de un foro
    @GetMapping("/foro/{foroId}")
    public ResponseEntity<List<ComentarioForoDTO>> listarPorForo(@PathVariable Integer foroId) {
        return ResponseEntity.ok(comentarioService.listarPorForo(foroId));
    }

    // 🔹 2. Listar respuestas de un comentario
    @GetMapping("/respuestas/{comentarioPadreId}")
    public ResponseEntity<List<ComentarioForoDTO>> listarRespuestas(@PathVariable Integer comentarioPadreId) {
        return ResponseEntity.ok(comentarioService.listarRespuestas(comentarioPadreId));
    }

    // 🔹 3. Crear comentario en un foro
    @PostMapping("/foro/{foroId}/usuario/{usuarioId}")
    public ResponseEntity<?> comentar(
            @PathVariable Integer foroId,
            @PathVariable Integer usuarioId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String contenido = body.get("contenido");
            if (contenido == null || contenido.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El contenido no puede estar vacío ❌");
            }

            ComentarioForoDTO comentario = comentarioService.comentarForo(foroId, usuarioId, contenido);
            return ResponseEntity.ok(comentario);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al crear comentario ❌");
        }
    }

    // 🔹 4. Responder a un comentario
    @PostMapping("/foro/{foroId}/usuario/{usuarioId}/responder/{comentarioPadreId}")
    public ResponseEntity<?> responder(
            @PathVariable Integer foroId,
            @PathVariable Integer usuarioId,
            @PathVariable Integer comentarioPadreId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String contenido = body.get("contenido");
            if (contenido == null || contenido.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El contenido no puede estar vacío ❌");
            }

            ComentarioForoDTO respuesta = comentarioService.responderComentario(foroId, comentarioPadreId, usuarioId, contenido);
            return ResponseEntity.ok(respuesta);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al responder comentario ❌");
        }
    }

    // 🔹 5. Editar comentario
    @PutMapping("/{idComentario}/usuario/{usuarioId}")
    public ResponseEntity<?> editar(
            @PathVariable Integer idComentario,
            @PathVariable Integer usuarioId,
            @RequestBody Map<String, String> body
    ) {
        try {
            String nuevoContenido = body.get("contenido");
            Optional<ComentarioForo> actualizado = comentarioService.editar(idComentario, usuarioId, nuevoContenido);
            if (actualizado.isPresent()) {
                return ResponseEntity.ok("Comentario actualizado con éxito ✅");
            } else {
                return ResponseEntity.status(403).body("No tienes permisos para editar este comentario ❌");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al editar comentario ❌");
        }
    }

    // 🔹 6. Eliminar comentario
    @DeleteMapping("/{idComentario}/usuario/{usuarioId}")
    public ResponseEntity<?> eliminar(
            @PathVariable Integer idComentario,
            @PathVariable Integer usuarioId
    ) {
        try {
            boolean eliminado = comentarioService.eliminar(idComentario, usuarioId);
            if (eliminado) {
                return ResponseEntity.ok("Comentario eliminado con éxito 🗑️");
            } else {
                return ResponseEntity.status(403).body("No tienes permisos para eliminar este comentario ❌");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error al eliminar comentario ❌");
        }
    }
}
