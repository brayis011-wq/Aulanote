package com.proyecto.spring.aulanote.aulanote.service;

import com.proyecto.spring.aulanote.aulanote.entity.Mensajes;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.repository.MensajesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MensajesService {

    @Autowired
    private MensajesRepository mensajesRepository;

    public List<Mensajes> listarMensajes() {
        return mensajesRepository.findAll();
    }

    public Optional<Mensajes> obtenerMensajePorId(int id) {
        return mensajesRepository.findById(id);
    }

    public Mensajes enviarMensaje(Mensajes mensaje) {
        return mensajesRepository.save(mensaje);
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
