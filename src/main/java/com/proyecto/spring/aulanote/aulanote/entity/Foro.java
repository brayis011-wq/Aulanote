package com.proyecto.spring.aulanote.aulanote.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



@Entity
@Table(name = "foro")
public class Foro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")  // 👈 aquí el nombre correcto en la BD
    private Integer id;

    @Column(nullable = false)
    private String titulo;

    private String descripcion;

    @Column(name = "fecha_creacion", nullable = false, updatable = false, insertable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "autor_id")
    private Integer autorId;

    // 🔹 Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
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

    public Integer getAutorId() {
        return autorId;
    }

    public void setAutorId(Integer autorId) {
        this.autorId = autorId;
    }
}

