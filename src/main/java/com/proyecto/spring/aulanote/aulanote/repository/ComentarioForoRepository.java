
package com.proyecto.spring.aulanote.aulanote.repository;

import com.proyecto.spring.aulanote.aulanote.entity.ComentarioForo;
import com.proyecto.spring.aulanote.aulanote.entity.Foro;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface ComentarioForoRepository extends JpaRepository<ComentarioForo, Integer> {
    List<ComentarioForo> findByForo_Id(Integer foroId);

    // 🔹 Listar solo los comentarios principales (sin padre) de un foro
    List<ComentarioForo> findByForoAndComentarioPadreIsNullOrderByFechaCreacionAsc(Foro foro);


    // 🔹 Listar las respuestas de un comentario específico
    List<ComentarioForo> findByComentarioPadre_IdComentarioOrderByFechaCreacionAsc(Integer comentarioPadreId);
}

