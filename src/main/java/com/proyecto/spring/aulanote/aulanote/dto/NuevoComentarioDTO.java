
package com.proyecto.spring.aulanote.aulanote.dto;

public class NuevoComentarioDTO {
    private String contenido;

    public NuevoComentarioDTO() {}
    public NuevoComentarioDTO(String contenido) {
        this.contenido = contenido;
    }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
}
