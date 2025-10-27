package com.proyecto.spring.aulanote.aulanote.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "comentarios_foro")
public class ComentarioForo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_comentario")
    private Integer idComentario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    // ✅ Fecha de creación automática al guardar el comentario
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    // 🔹 Relación con Usuario
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // 🔹 Relación con Foro
    @ManyToOne
    @JoinColumn(name = "id_foro", nullable = false)
    private Foro foro;

    // 🔹 Comentario padre (para respuestas)
    @ManyToOne
    @JoinColumn(name = "comentario_padre_id")
    private ComentarioForo comentarioPadre;

    // 🔹 Lista de respuestas
    @OneToMany(mappedBy = "comentarioPadre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ComentarioForo> respuestas;

    // ✅ Método que se ejecuta antes de insertar en la base de datos
    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // --- Getters y Setters ---
    public Integer getIdComentario() {
        return idComentario;
    }

    public void setIdComentario(Integer idComentario) {
        this.idComentario = idComentario;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Foro getForo() {
        return foro;
    }

    public void setForo(Foro foro) {
        this.foro = foro;
    }

    public ComentarioForo getComentarioPadre() {
        return comentarioPadre;
    }

    public void setComentarioPadre(ComentarioForo comentarioPadre) {
        this.comentarioPadre = comentarioPadre;
    }

    public List<ComentarioForo> getRespuestas() {
        return respuestas;
    }

    public void setRespuestas(List<ComentarioForo> respuestas) {
        this.respuestas = respuestas;
    }
}
