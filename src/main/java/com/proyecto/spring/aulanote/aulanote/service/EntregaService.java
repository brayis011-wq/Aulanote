package com.proyecto.spring.aulanote.aulanote.service;

import java.io.File;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.proyecto.spring.aulanote.aulanote.dto.EntregaDTO;
import com.proyecto.spring.aulanote.aulanote.entity.Entrega;
import com.proyecto.spring.aulanote.aulanote.repository.EntregaRepository;

@Service
public class EntregaService {

    @Autowired
    private EntregaRepository entregaRepository;

    // ✅ Obtener entregas por curso en formato DTO
    public List<EntregaDTO> obtenerEntregasDTOPorCurso(Integer idCurso) {
        List<Entrega> entregas = entregaRepository.findByCursoIdCurso(idCurso);
        return entregas.stream()
                       .map(EntregaDTO::new)
                       .collect(Collectors.toList());
    }

    // ✅ Listar todas las entregas
    public List<Entrega> listarEntregas() {
        return entregaRepository.findAll();
    }

    // ✅ Obtener entregas por idCurso
    public List<Entrega> obtenerEntregasPorCurso(Integer idCurso) {
        return entregaRepository.findByCursoIdCurso(idCurso);
    }

    // ✅ Obtener por id
    public Optional<Entrega> obtenerEntregaPorId(Integer id) {
        return entregaRepository.findById(id);
    }

    // ✅ Crear entrega
    public Entrega crearEntrega(Entrega entrega) {
        return entregaRepository.save(entrega);
    }

    // ✅ Actualizar entrega
    public Optional<Entrega> actualizarEntrega(Integer id, Entrega entregaDetalles) {
        return entregaRepository.findById(id).map(entrega -> {
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

    // ✅ Eliminar entrega (solo BD)
    public Boolean eliminarEntrega(Integer id) {
        return entregaRepository.findById(id).map(entrega -> {
            entregaRepository.delete(entrega);
            return true;
        }).orElse(false);
    }

// ✅ Calificar entrega
public Optional<Entrega> calificarEntrega(Integer id, BigDecimal calificacion) {
    if (calificacion == null) {
        throw new IllegalArgumentException("La calificación no puede estar vacía");
    }

    // Validación 0 a 5
    if (calificacion.compareTo(BigDecimal.ZERO) < 0 || calificacion.compareTo(new BigDecimal(5)) > 0) {
        throw new IllegalArgumentException("La calificación debe estar entre 0 y 5");
    }

    return entregaRepository.findById(id).map(entrega -> {
        entrega.setCalificacion(calificacion);
        return entregaRepository.save(entrega);
    });
}



    // -----------------------------------------------------------
    // 🔽 NUEVOS MÉTODOS AÑADIDOS 🔽
    // -----------------------------------------------------------

    // ✅ Listar entregas por usuario
    public List<EntregaDTO> listarPorUsuario(Integer idUsuario) {
        List<Entrega> entregas = entregaRepository.findByIdUsuario(idUsuario);
        return entregas.stream()
                .map(EntregaDTO::new)
                .collect(Collectors.toList());
    }

    // ✅ Editar entrega (nombre y/o archivo PDF)
    public String editarEntrega(Integer idEntrega, String nuevoNombre, MultipartFile nuevoArchivo) throws Exception {
        Optional<Entrega> entregaOpt = entregaRepository.findById(idEntrega);
        if (entregaOpt.isEmpty()) {
            throw new Exception("Entrega no encontrada");
        }

        Entrega entrega = entregaOpt.get();
        entrega.setNombreTarea(nuevoNombre);
        entrega.setFechaEntrega(java.time.LocalDateTime.now());

        if (nuevoArchivo != null && !nuevoArchivo.isEmpty()) {
            if (!"application/pdf".equals(nuevoArchivo.getContentType())) {
                throw new Exception("Solo se permiten archivos PDF");
            }

            String carpetaUploads = System.getProperty("user.dir") + File.separator + "uploads";
            Path rutaAntigua = Paths.get(carpetaUploads, entrega.getRutaArchivo());

            if (Files.exists(rutaAntigua)) {
                Files.delete(rutaAntigua);
            }

            String nuevoNombreArchivo = System.currentTimeMillis() + "_" + nuevoArchivo.getOriginalFilename();
            Path nuevaRuta = Paths.get(carpetaUploads, nuevoNombreArchivo);
            nuevoArchivo.transferTo(nuevaRuta.toFile());

            entrega.setNombreArchivo(nuevoNombreArchivo);
            entrega.setRutaArchivo(nuevoNombreArchivo);
        }

        entregaRepository.save(entrega);
        return "✅ Entrega actualizada correctamente";
    }

    // ✅ Eliminar entrega físicamente (archivo + BD)
    public boolean eliminarEntregaFisicamente(Integer idEntrega) throws Exception {
        Optional<Entrega> entregaOpt = entregaRepository.findById(idEntrega);
        if (entregaOpt.isEmpty()) {
            return false;
        }

        Entrega entrega = entregaOpt.get();

        String carpetaUploads = System.getProperty("user.dir") + File.separator + "uploads";
        Path rutaArchivo = Paths.get(carpetaUploads, entrega.getRutaArchivo());
        if (Files.exists(rutaArchivo)) {
            Files.delete(rutaArchivo);
        }

        entregaRepository.delete(entrega);
        return true;
    }
}
