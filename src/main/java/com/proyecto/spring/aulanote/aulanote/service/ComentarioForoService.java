package com.proyecto.spring.aulanote.aulanote.service;

import com.proyecto.spring.aulanote.aulanote.entity.ComentarioForo;
import com.proyecto.spring.aulanote.aulanote.entity.Foro;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.repository.ComentarioForoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComentarioForoService {

    @Autowired
    private ComentarioForoRepository comentarioRepo;

    // Listar todos los comentarios
    public List<ComentarioForo> listarTodos() {
        return comentarioRepo.findAll();
    }

    // Listar comentarios por foro
    public List<ComentarioForo> listarPorForo(Integer foroId) {
        return comentarioRepo.findByForo_Id(foroId);
    }

    // Guardar comentario con validación segura
   // Comentar directamente en un foro
    public ComentarioForo comentarForo(Integer foroId, Integer usuarioId, String contenido) {
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

    return comentarioRepo.save(comentario);
}


    // Eliminar comentario
    public boolean eliminar(Integer id) {
        if (id == null || !comentarioRepo.existsById(id)) return false;
        comentarioRepo.deleteById(id);
        return true;
    }
}
