package com.proyecto.spring.aulanote.aulanote.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.proyecto.spring.aulanote.aulanote.entity.Tareas;
import java.util.List;

 @Repository
public interface TareasRepository extends JpaRepository<Tareas, Integer> {
    List<Tareas> findByProfesorId(Integer profesorId);

    List<Tareas> findByCurso_IdCurso(Integer cursoId);

    List<Tareas> findByProfesorIdAndCurso_IdCurso(Integer profesorId, Integer cursoId);
}


