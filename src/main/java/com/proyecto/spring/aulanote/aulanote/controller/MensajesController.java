package com.proyecto.spring.aulanote.aulanote.controller;

import com.proyecto.spring.aulanote.aulanote.entity.Mensajes;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.service.MensajesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mensajes")
public class MensajesController {

    @Autowired
    private MensajesService mensajesService;

    // Listar todos los mensajes
    @GetMapping
    public List<Mensajes> listarMensajes() {
        return mensajesService.listarMensajes();
    }

    // Obtener un mensaje por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Mensajes> obtenerPorId(@PathVariable int id) {
        Optional<Mensajes> mensaje = mensajesService.obtenerMensajePorId(id);
        return mensaje.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Enviar un mensaje
    @PostMapping
    public Mensajes enviarMensaje(@RequestBody Mensajes mensaje) {
        return mensajesService.enviarMensaje(mensaje);
    }

    // Eliminar un mensaje
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMensaje(@PathVariable int id) {
        boolean eliminado = mensajesService.eliminarMensaje(id);
        if (eliminado) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener mensajes enviados por un usuario
    @GetMapping("/enviados/{idUsuario}")
    public List<Mensajes> obtenerEnviados(@PathVariable int idUsuario) {
        Usuario remitente = new Usuario();
        remitente.setId(idUsuario); // Usamos solo el ID
        return mensajesService.obtenerMensajesEnviados(remitente);
    }

    // Obtener mensajes recibidos por un usuario
    @GetMapping("/recibidos/{idUsuario}")
    public List<Mensajes> obtenerRecibidos(@PathVariable int idUsuario) {
        Usuario destinatario = new Usuario();
        destinatario.setId(idUsuario); // Usamos solo el ID
        return mensajesService.obtenerMensajesRecibidos(destinatario);
    }
}
