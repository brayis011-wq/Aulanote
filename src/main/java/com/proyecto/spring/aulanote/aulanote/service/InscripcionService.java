package com.proyecto.spring.aulanote.aulanote.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.spring.aulanote.aulanote.entity.Curso;
import com.proyecto.spring.aulanote.aulanote.entity.Inscripcion;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.repository.CursoRepository;
import com.proyecto.spring.aulanote.aulanote.repository.InscripcionRepository;

@Service
public class InscripcionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    @Autowired
    private CursoRepository cursoRepository;

    // 🔹 Listar estudiantes de un curso
    public List<Usuario> listarEstudiantesPorCurso(int cursoId) {
        return cursoRepository.findById(cursoId)
                .map(curso -> curso.getInscripciones()
                    .stream()
                    .map(Inscripcion::getUsuario)
                    .toList()
                ).orElse(List.of());
    }

    // CRUD normal de inscripciones
    public List<Inscripcion> listarInscripciones() {
        return inscripcionRepository.findAll();
    }

    public Optional<Inscripcion> obtenerInscripcionPorId(Integer id) {
        return inscripcionRepository.findById(id);
    }

    public Inscripcion crearInscripcion(Inscripcion inscripcion) {
        return inscripcionRepository.save(inscripcion);
    }

    public Optional<Inscripcion> actualizarInscripcion(Integer id, Inscripcion inscripcionDetalles) {
        return inscripcionRepository.findById(id).map(inscripcion -> {
            inscripcion.setUsuario(inscripcionDetalles.getUsuario());
            inscripcion.setCurso(inscripcionDetalles.getCurso());
            inscripcion.setFechaInscripcion(inscripcionDetalles.getFechaInscripcion());
            return inscripcionRepository.save(inscripcion);
        });
    }

    public Boolean eliminarInscripcion(Integer id) {
        return inscripcionRepository.findById(id).map(inscripcion -> {
            inscripcionRepository.delete(inscripcion);
            return true;
        }).orElse(false);
    }
}
