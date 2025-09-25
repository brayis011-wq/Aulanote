package com.proyecto.spring.aulanote.aulanote.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyecto.spring.aulanote.aulanote.entity.Entrega;

@Repository
public interface EntregaRepository extends JpaRepository<Entrega, Integer> {

    // Buscar entregas por curso
    List<Entrega> findByCursoIdCurso(Integer idCurso);

    // 👇 Query personalizada para promedios
    @Query("SELECT e.curso.idCurso, e.curso.nombre, AVG(e.calificacion) " +
           "FROM Entrega e " +
           "GROUP BY e.curso.idCurso, e.curso.nombre")
    List<Object[]> obtenerPromedioPorCurso();
    // 👇 Query personalizada para promedios por usuario
    @Query("SELECT e.curso.idCurso, e.curso.nombre, AVG(e.calificacion) " +
       "FROM Entrega e " +
       "WHERE e.idUsuario = :idUsuario " +
       "GROUP BY e.curso.idCurso, e.curso.nombre")
List<Object[]> obtenerPromedioPorUsuario(@Param("idUsuario") Integer idUsuario);

}
