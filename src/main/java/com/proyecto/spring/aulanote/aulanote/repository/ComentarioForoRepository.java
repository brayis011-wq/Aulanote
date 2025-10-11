
package com.proyecto.spring.aulanote.aulanote.repository;

import com.proyecto.spring.aulanote.aulanote.entity.ComentarioForo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComentarioForoRepository extends JpaRepository<ComentarioForo, Integer> {
    List<ComentarioForo> findByForo_Id(Integer foroId);
}
