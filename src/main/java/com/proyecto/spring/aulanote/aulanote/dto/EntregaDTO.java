package com.proyecto.spring.aulanote.aulanote.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;


// ✅ Importar la entidad Entrega
import com.proyecto.spring.aulanote.aulanote.entity.Entrega;

public class EntregaDTO {
    private Integer idEntrega;
    private Integer idUsuario;
    private String nombreTarea;
    private BigDecimal calificacion;
    private LocalDateTime fechaEntrega;

    // Constructor
    public EntregaDTO(Entrega e) {
        this.idEntrega = e.getIdEntrega();
        this.idUsuario = e.getIdUsuario();
        this.nombreTarea = e.getNombreTarea();
        this.calificacion = e.getCalificacion();
        this.fechaEntrega = e.getFechaEntrega();
    }

    // Getters y Setters
    public Integer getIdEntrega() {
        return idEntrega;
    }

    public void setIdEntrega(Integer idEntrega) {
        this.idEntrega = idEntrega;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombreTarea() {
        return nombreTarea;
    }

    public void setNombreTarea(String nombreTarea) {
        this.nombreTarea = nombreTarea;
    }

    public BigDecimal getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(BigDecimal calificacion) {
        this.calificacion = calificacion;
    }

    public LocalDateTime getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDateTime fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    
}
