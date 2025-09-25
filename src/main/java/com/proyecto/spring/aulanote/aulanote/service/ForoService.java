package com.proyecto.spring.aulanote.aulanote.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.spring.aulanote.aulanote.entity.Foro;
import com.proyecto.spring.aulanote.aulanote.repository.ForoRepository;

@Service
public class ForoService {

    @Autowired
    private ForoRepository foroRepository;

    // Listar todos los foros
    public List<Foro> listarForos() {
        return foroRepository.findAll();
    }

    // Crear un nuevo foro
    public Foro crearForo(Foro foro) {
        return foroRepository.save(foro);
    }

    // Obtener foro por ID
    public Optional<Foro> obtenerForoPorId(Integer id) {
        return foroRepository.findById(id);
    }

    // Actualizar un foro
    public Optional<Foro> actualizarForo(Integer id, Foro foroDetalles) {
        return foroRepository.findById(id).map(foro -> {
            foro.setTitulo(foroDetalles.getTitulo());
            foro.setDescripcion(foroDetalles.getDescripcion());
            foro.setAutorId(foroDetalles.getAutorId()); // 👈 corregido
            // ⚠️ No actualizamos fechaCreacion, ya que es automática
            return foroRepository.save(foro);
        });
    }

    // Eliminar un foro
    public Boolean eliminarForo(Integer id) {
        return foroRepository.findById(id).map(foro -> {
            foroRepository.delete(foro);
            return true;
        }).orElse(false);
    }
}
