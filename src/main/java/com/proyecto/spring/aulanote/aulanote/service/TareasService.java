package com.proyecto.spring.aulanote.aulanote.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.spring.aulanote.aulanote.entity.Tareas;
import com.proyecto.spring.aulanote.aulanote.repository.TareasRepository;

@Service
public class TareasService {

    @Autowired
    private TareasRepository tareasRepository;

    public List<Tareas> listarTareas() {
        return tareasRepository.findAll();
    }

    public Tareas crearTarea(Tareas tarea) {
        return tareasRepository.save(tarea);
    }

    public Optional<Tareas> obtenerTareaPorId(Integer id) {
        return tareasRepository.findById(id);
    }

    public List<Tareas> listarPorProfesor(Integer profesorId) {
        return tareasRepository.findByProfesorId(profesorId);
    }

    public List<Tareas> listarPorCurso(Integer cursoId) {
        return tareasRepository.findByCurso_IdCurso(cursoId);
    }

    public List<Tareas> listarPorProfesorYCurso(Integer profesorId, Integer cursoId) {
        return tareasRepository.findByProfesorIdAndCurso_IdCurso(profesorId, cursoId);
    }

    public Optional<Tareas> actualizarTarea(Integer id, Tareas tareaDetalles, Integer profesorId) {
        return tareasRepository.findById(id).map(tarea -> {
            if (!tarea.getProfesorId().equals(profesorId)) {
                throw new RuntimeException("❌ No puedes modificar esta tarea, no es tuya.");
            }
            tarea.setNombreActividad(tareaDetalles.getNombreActividad());
            tarea.setDescripcion(tareaDetalles.getDescripcion());
            tarea.setFechaLimite(tareaDetalles.getFechaLimite());
            tarea.setCurso(tareaDetalles.getCurso()); // 📌 permitir cambiar curso
            return tareasRepository.save(tarea);
        });
    }

    public Boolean eliminarTarea(Integer id, Integer profesorId) {
        return tareasRepository.findById(id).map(tarea -> {
            if (!tarea.getProfesorId().equals(profesorId)) {
                throw new RuntimeException("❌ No puedes eliminar esta tarea, no es tuya.");
            }
            tareasRepository.delete(tarea);
            return true;
        }).orElse(false);
    }
    
}

