// ComentarioForoDTO.java
package com.proyecto.spring.aulanote.aulanote.dto;

public class ComentarioForoDTO {
    private Integer idComentario;
    private String autor;
    private String contenido;
    private String fecha;
    private Integer usuarioId;

    public ComentarioForoDTO(Integer idComentario, String autor, String contenido, String fecha, Integer usuarioId) {
        this.idComentario = idComentario;
        this.autor = autor;
        this.contenido = contenido;
        this.fecha = fecha;
        this.usuarioId = usuarioId;
    }

    public Integer getIdComentario() { return idComentario; }
    public void setIdComentario(Integer idComentario) { this.idComentario = idComentario; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }
}
