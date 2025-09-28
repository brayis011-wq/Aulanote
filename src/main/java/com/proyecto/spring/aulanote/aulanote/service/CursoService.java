package com.proyecto.spring.aulanote.aulanote.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.spring.aulanote.aulanote.entity.Curso;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.repository.CursoRepository;
import com.proyecto.spring.aulanote.aulanote.repository.UsuarioRepository;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    public List<Curso> listarCursos() {
        return cursoRepository.findAll();
    }

    public Optional<Curso> obtenerCursoPorId(int id) {
        return cursoRepository.findById(id);
    }

    public Curso crearCurso(Curso curso) {
        return cursoRepository.save(curso);
    }

    public Optional<Curso> actualizarCurso(int id, Curso cursoDetalles) {
        return cursoRepository.findById(id).map(curso -> {
            curso.setNombre(cursoDetalles.getNombre());
            curso.setDescripcion(cursoDetalles.getDescripcion());
            curso.setProfesor(cursoDetalles.getProfesor());
            return cursoRepository.save(curso);
        });
    }

    public Boolean eliminarCurso(int id) {
        return cursoRepository.findById(id).map(curso -> {
            cursoRepository.delete(curso);
            return true;
        }).orElse(false);
    }
    public List<Curso> listarCursosPorProfesor(Usuario profesor) {
        return cursoRepository.findByProfesor(profesor);
    }
    @Autowired
    private UsuarioRepository usuarioRepository; // Si tienes repo de Usuario

    public List<Curso> listarCursosPorProfesorId(int profesorId) {
        return usuarioRepository.findById(profesorId)
                .map(profesor -> cursoRepository.findByProfesor(profesor))
                .orElse(List.of()); // devuelve lista vacía si no existe profesor
    }

}
