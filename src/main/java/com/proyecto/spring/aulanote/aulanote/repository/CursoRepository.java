package com.proyecto.spring.aulanote.aulanote.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.spring.aulanote.aulanote.entity.Curso;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {
    List<Curso> findByProfesor(Usuario profesor);
}
