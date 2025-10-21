package com.proyecto.spring.aulanote.aulanote.dto;

public class MensajeDTO {
    private Integer idDestinatario;
    private String mensaje;

    public Integer getIdDestinatario() {
        return idDestinatario;
    }

    public void setIdDestinatario(Integer idDestinatario) {
        this.idDestinatario = idDestinatario;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
