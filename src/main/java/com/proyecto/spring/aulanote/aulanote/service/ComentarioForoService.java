package com.proyecto.spring.aulanote.aulanote.service;

import com.proyecto.spring.aulanote.aulanote.dto.ComentarioForoDTO;
import com.proyecto.spring.aulanote.aulanote.entity.ComentarioForo;
import com.proyecto.spring.aulanote.aulanote.entity.Foro;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.repository.ComentarioForoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ComentarioForoService {

    @Autowired
    private ComentarioForoRepository comentarioRepo;

    // 🔹 Listar comentarios por foro -> devuelve DTOs
    public List<ComentarioForoDTO> listarPorForo(Integer foroId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return comentarioRepo.findByForo_Id(foroId).stream()
                .map(c -> new ComentarioForoDTO(
                        c.getUsuario().getNombre() + " " + c.getUsuario().getApellido(),
                        c.getContenido(),
                        c.getFechaCreacion() != null ? c.getFechaCreacion().format(formatter) : ""
                ))
                .collect(Collectors.toList());
    }

    // 🔹 Editar comentario (solo dueño)
    public Optional<ComentarioForo> editar(Integer id, Integer usuarioId, String nuevoContenido) {
        if (id == null || usuarioId == null || nuevoContenido == null || nuevoContenido.trim().isEmpty()) {
            return Optional.empty();
        }

        return comentarioRepo.findById(id).map(c -> {
            if (!c.getUsuario().getId().equals(usuarioId)) {
                return null; // ❌ No es dueño → no puede editar
            }
            c.setContenido(nuevoContenido);
            return comentarioRepo.save(c);
        });
    }

    // 🔹 Crear comentario
    public ComentarioForoDTO comentarForo(Integer foroId, Integer usuarioId, String contenido) {
        if (foroId == null || usuarioId == null || contenido == null || contenido.trim().isEmpty()) {
            throw new IllegalArgumentException("Datos inválidos para comentar");
        }

        Foro foro = new Foro();
        foro.setId(foroId);

        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);

        ComentarioForo comentario = new ComentarioForo();
        comentario.setContenido(contenido);
        comentario.setForo(foro);
        comentario.setUsuario(usuario);

        ComentarioForo guardado = comentarioRepo.save(comentario);

        return new ComentarioForoDTO(
                usuario.getNombre() + " " + usuario.getApellido(),
                guardado.getContenido(),
                guardado.getFechaCreacion() != null
                        ? guardado.getFechaCreacion().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                        : ""
        );
    }

    // 🔹 Eliminar comentario (dueño o admin/profesor)
    public boolean eliminar(Integer id, Integer usuarioId) {
        if (id == null || usuarioId == null) return false;

        return comentarioRepo.findById(id).map(c -> {
            Usuario autor = c.getUsuario();

            // ✅ Si es dueño del comentario
            if (autor.getId().equals(usuarioId)) {
                comentarioRepo.deleteById(id);
                return true;
            }

            // ✅ Si el usuario es profesor/admin (ejemplo con campo "cargo")
            if (autor.getCargo() != null &&
                    (autor.getCargo().equalsIgnoreCase("profesor")
                            || autor.getCargo().equalsIgnoreCase("admin"))) {
                comentarioRepo.deleteById(id);
                return true;
            }

            return false; // ❌ No tiene permisos
        }).orElse(false);
    }
}
