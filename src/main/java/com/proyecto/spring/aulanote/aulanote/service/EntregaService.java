package com.proyecto.spring.aulanote.aulanote.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.proyecto.spring.aulanote.aulanote.entity.Entrega;
import com.proyecto.spring.aulanote.aulanote.repository.EntregaRepository;

@Service
public class EntregaService {

    @Autowired
    private EntregaRepository entregaRepository;

    // Listar todas las entregas
    public List<Entrega> listarEntregas() {
        return entregaRepository.findAll();
    }

  // Obtener entregas por idCurso
    public List<Entrega> obtenerEntregasPorCurso(Integer idCurso) {
    return entregaRepository.findByCursoIdCurso(idCurso);
    }


    // Obtener por id
    public Optional<Entrega> obtenerEntregaPorId(Integer id) {
        return entregaRepository.findById(id);
    }

    // Crear entrega
    public Entrega crearEntrega(Entrega entrega) {
        return entregaRepository.save(entrega);
    }

    // Actualizar entrega
    public Optional<Entrega> actualizarEntrega(Integer id, Entrega entregaDetalles) {
        return entregaRepository.findById(id).map(entrega -> {
            // Actualiza los campos que quieras permitir cambiar
            entrega.setIdUsuario(entregaDetalles.getIdUsuario());
            entrega.setNombreTarea(entregaDetalles.getNombreTarea());
            entrega.setNombreArchivo(entregaDetalles.getNombreArchivo());
            entrega.setRutaArchivo(entregaDetalles.getRutaArchivo());
            entrega.setFechaEntrega(entregaDetalles.getFechaEntrega());
            entrega.setCalificacion(entregaDetalles.getCalificacion());
            entrega.setCurso(entregaDetalles.getCurso());
            return entregaRepository.save(entrega);
        });
    }

    // Eliminar entrega
    public Boolean eliminarEntrega(Integer id) {
        return entregaRepository.findById(id).map(entrega -> {
            entregaRepository.delete(entrega);
            return true;
        }).orElse(false);
    }

    // Calificar entrega
    public Optional<Entrega> calificarEntrega(Integer id, BigDecimal calificacion) {
        return entregaRepository.findById(id).map(entrega -> {
            entrega.setCalificacion(calificacion);
            return entregaRepository.save(entrega);
        });
    }
}
