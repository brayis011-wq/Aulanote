package com.proyecto.spring.aulanote.aulanote.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.spring.aulanote.aulanote.entity.Curso;
import com.proyecto.spring.aulanote.aulanote.repository.CursoRepository;

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
}
