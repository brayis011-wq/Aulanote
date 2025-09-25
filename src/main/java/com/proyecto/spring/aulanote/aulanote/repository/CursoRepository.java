package com.proyecto.spring.aulanote.aulanote.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.proyecto.spring.aulanote.aulanote.entity.Curso;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {
}
