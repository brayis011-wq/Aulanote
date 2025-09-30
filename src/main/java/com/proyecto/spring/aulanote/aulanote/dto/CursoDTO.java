package com.proyecto.spring.aulanote.aulanote.dto;

import java.time.LocalDateTime;

public class CursoDTO {
    private Integer idCurso;
    private String nombre;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private String profesorNombre;

    // ===== Constructor =====
    public CursoDTO(Integer idCurso, String nombre, String descripcion, LocalDateTime fechaCreacion, String profesorNombre) {
        this.idCurso = idCurso;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaCreacion = fechaCreacion;
        this.profesorNombre = profesorNombre;
    }

    // ===== Getters & Setters =====
    public Integer getIdCurso() {
        return idCurso;
    }

    public void setIdCurso(Integer idCurso) {
        this.idCurso = idCurso;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getProfesorNombre() {
        return profesorNombre;
    }

    public void setProfesorNombre(String profesorNombre) {
        this.profesorNombre = profesorNombre;
    }
}
