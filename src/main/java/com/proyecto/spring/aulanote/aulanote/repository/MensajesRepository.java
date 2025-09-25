package com.proyecto.spring.aulanote.aulanote.repository;

import com.proyecto.spring.aulanote.aulanote.entity.Mensajes;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensajesRepository extends JpaRepository<Mensajes, Integer> {
    List<Mensajes> findByRemitente(Usuario remitente);
    List<Mensajes> findByDestinatario(Usuario destinatario);
}
