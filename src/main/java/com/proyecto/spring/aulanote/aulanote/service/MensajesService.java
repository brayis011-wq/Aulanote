package com.proyecto.spring.aulanote.aulanote.service;

import com.proyecto.spring.aulanote.aulanote.entity.Mensajes;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.repository.MensajesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MensajesService {


    @Autowired
    private MensajesRepository mensajesRepository;

    public Mensajes enviarMensaje(Mensajes mensaje) {
        // Si la fecha no viene desde el frontend, se asigna automáticamente
        if (mensaje.getFecha() == null) {
            mensaje.setFecha(LocalDateTime.now());
        }
        return mensajesRepository.save(mensaje);
    }


    public List<Mensajes> listarMensajes() {
        return mensajesRepository.findAll();
    }

    public Optional<Mensajes> obtenerMensajePorId(int id) {
        return mensajesRepository.findById(id);
    }

 

    public Boolean eliminarMensaje(int id) {
        return mensajesRepository.findById(id).map(mensaje -> {
            mensajesRepository.delete(mensaje);
            return true;
        }).orElse(false);
    }

    public List<Mensajes> obtenerMensajesEnviados(Usuario remitente) {
        return mensajesRepository.findByRemitente(remitente);
    }

    public List<Mensajes> obtenerMensajesRecibidos(Usuario destinatario) {
        return mensajesRepository.findByDestinatario(destinatario);
    }
}