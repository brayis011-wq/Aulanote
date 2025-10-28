package com.proyecto.spring.aulanote.aulanote.service;

import com.proyecto.spring.aulanote.aulanote.dto.ComentarioForoDTO;
import com.proyecto.spring.aulanote.aulanote.entity.ComentarioForo;
import com.proyecto.spring.aulanote.aulanote.entity.Foro;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.repository.ComentarioForoRepository;
import com.proyecto.spring.aulanote.aulanote.repository.UsuarioRepository;
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

    @Autowired
    private UsuarioRepository usuarioRepo; // 🔹 para obtener nombre y apellido

    // 🔹 Listar comentarios por foro
    public List<ComentarioForoDTO> listarPorForo(Integer foroId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        return comentarioRepo.findByForo_Id(foroId).stream()
                .map(c -> new ComentarioForoDTO(
                        c.getIdComentario(),
                        c.getUsuario().getNombre() + " " + c.getUsuario().getApellido(),
                        c.getContenido(),
                        c.getFechaCreacion() != null ? c.getFechaCreacion().format(formatter) : "",
                        c.getUsuario().getId()
                ))
                .collect(Collectors.toList());
    }

    // 🔹 Crear comentario
    public ComentarioForoDTO comentarForo(Integer foroId, Integer usuarioId, String contenido) {
        if (foroId == null || usuarioId == null || contenido == null || contenido.trim().isEmpty()) {
            throw new IllegalArgumentException("Datos inválidos para comentar");
        }

        Foro foro = new Foro();
        foro.setId(foroId);

        // ✅ Buscar usuario real en BD
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        ComentarioForo comentario = new ComentarioForo();
        comentario.setContenido(contenido);
        comentario.setForo(foro);
        comentario.setUsuario(usuario);

        ComentarioForo guardado = comentarioRepo.save(comentario);

        return new ComentarioForoDTO(
                guardado.getIdComentario(),
                usuario.getNombre() + " " + usuario.getApellido(),
                guardado.getContenido(),
                guardado.getFechaCreacion() != null
                        ? guardado.getFechaCreacion().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                        : "",
                usuario.getId()
        );
    }

    // 🔹 Editar comentario (solo dueño)
    public Optional<ComentarioForo> editar(Integer idComentario, Integer usuarioId, String nuevoContenido) {
        if (idComentario == null || usuarioId == null || nuevoContenido == null || nuevoContenido.trim().isEmpty()) {
            return Optional.empty();
        }

        return comentarioRepo.findById(idComentario).map(c -> {
            if (!c.getUsuario().getId().equals(usuarioId)) {
                return null; // ❌ no es dueño → no edita
            }
            c.setContenido(nuevoContenido);
            return comentarioRepo.save(c);
        });
    }

    // 🔹 Eliminar comentario (dueño o profesor/admin)
   public boolean eliminar(Integer idComentario, Integer usuarioId) {
    if (idComentario == null || usuarioId == null) return false;

    return comentarioRepo.findById(idComentario).map(c -> {
        Usuario autor = c.getUsuario();
        Optional<Usuario> usuarioOpt = usuarioRepo.findById(usuarioId);

        if (usuarioOpt.isEmpty()) return false;
        Usuario usuario = usuarioOpt.get();

        // ✅ Puede eliminar si es dueño
        if (autor.getId().equals(usuarioId)) {
            comentarioRepo.deleteById(idComentario);
            return true;
        }

        // ✅ O si el usuario que intenta eliminar es profesor o admin
        if (usuario.getCargo() != null &&
                (usuario.getCargo().equalsIgnoreCase("profesor")
                        || usuario.getCargo().equalsIgnoreCase("admin"))) {
            comentarioRepo.deleteById(idComentario);
            return true;
        }

        return false;
    }).orElse(false);
}
    // 🔹 Responder a un comentario
public ComentarioForoDTO responderComentario(Integer foroId, Integer comentarioPadreId, Integer usuarioId, String contenido) {
    if (foroId == null || comentarioPadreId == null || usuarioId == null || contenido == null || contenido.trim().isEmpty()) {
        throw new IllegalArgumentException("Datos inválidos para responder comentario");
    }

    // Crear entidades referenciales sin tener que cargarlas completamente
    Foro foro = new Foro();
    foro.setId(foroId);

    Usuario usuario = usuarioRepo.findById(usuarioId)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

    ComentarioForo comentarioPadre = comentarioRepo.findById(comentarioPadreId)
            .orElseThrow(() -> new IllegalArgumentException("Comentario padre no encontrado"));

    ComentarioForo respuesta = new ComentarioForo();
    respuesta.setContenido(contenido);
    respuesta.setForo(foro);
    respuesta.setUsuario(usuario);
    respuesta.setComentarioPadre(comentarioPadre);

    ComentarioForo guardado = comentarioRepo.save(respuesta);

    return new ComentarioForoDTO(
            guardado.getIdComentario(),
            usuario.getNombre() + " " + usuario.getApellido(),
            guardado.getContenido(),
            guardado.getFechaCreacion() != null
                    ? guardado.getFechaCreacion().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                    : "",
            usuario.getId()
    );
}


// 🔹 Listar respuestas de un comentario específico
public List<ComentarioForoDTO> listarRespuestas(Integer comentarioPadreId) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    return comentarioRepo.findByComentarioPadre_IdComentarioOrderByFechaCreacionAsc(comentarioPadreId)
            .stream()
            .map(r -> {
                ComentarioForoDTO dto = new ComentarioForoDTO(
                        r.getIdComentario(),
                        r.getUsuario().getNombre() + " " + r.getUsuario().getApellido(),
                        r.getContenido(),
                        r.getFechaCreacion() != null ? r.getFechaCreacion().format(formatter) : "",
                        r.getUsuario().getId()
                );
                dto.setComentarioPadreId(comentarioPadreId);
                return dto;
            })
            .collect(Collectors.toList());
}

}
