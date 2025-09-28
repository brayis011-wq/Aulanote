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

public Optional<Tareas> actualizarTarea(Integer id, Tareas tareaDetalles, Integer profesorId) {
    return tareasRepository.findById(id).map(tarea -> {
        if (!tarea.getProfesorId().equals(profesorId)) {
            throw new RuntimeException("❌ No puedes modificar esta tarea, no es tuya.");
        }
        tarea.setNombreActividad(tareaDetalles.getNombreActividad());
        tarea.setDescripcion(tareaDetalles.getDescripcion());
        tarea.setFechaLimite(tareaDetalles.getFechaLimite());
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



    // --- Métodos personalizados ---
    public Optional<Tareas> calificarTarea(Integer id, String calificacion) {
        return tareasRepository.findById(id).map(tarea -> {
            // Si quieres guardar la calificación, necesitaríamos un campo en la entidad
            // Ejemplo: tarea.setCalificacion(calificacion);
            return tareasRepository.save(tarea);
        });
    }
    
}
