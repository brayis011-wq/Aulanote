package com.proyecto.spring.aulanote.aulanote.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.proyecto.spring.aulanote.aulanote.entity.Tareas;
import java.util.List;

@Repository
public interface TareasRepository extends JpaRepository<Tareas, Integer> {
    // 📌 Buscar todas las tareas de un profesor
    List<Tareas> findByProfesorId(Integer profesorId);
}
