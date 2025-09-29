package com.proyecto.spring.aulanote.aulanote.dto;

public class ComentarioForoDTO {
    private String autor;
    private String contenido;
    private String fecha;

    public ComentarioForoDTO(String autor, String contenido, String fecha) {
        this.autor = autor;
        this.contenido = contenido;
        this.fecha = fecha;
    }

    public String getAutor() {
        return autor;
    }

    public String getContenido() {
        return contenido;
    }

    public String getFecha() {
        return fecha;
    }
}
