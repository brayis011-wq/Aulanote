package com.proyecto.spring.aulanote.aulanote.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuario")
public class Usuario {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;
    @Column(name = "apellido", nullable = false, length = 50)
    private String apellido;
    @Column(name = "contrasena", nullable = false, length = 255)
    private String contrasena;
    @Column(name = "correo", nullable = false, length = 100, unique = true)
    private String email;
    @Column(name = "cargo", nullable = false, length = 100)
    private String cargo;
    @Column(name = "profesor_id", nullable = true)
    private Integer profesorId;
    @Column(name = "activo")
    private Boolean activo = true;


    // Constructor
    public Usuario() {}
    public Usuario(String nombre, String apellido, String contrasena, String email, String cargo) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.contrasena = contrasena;
        this.email = email;
        this.cargo = cargo;
    }

    // Getters and Setters
    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }
    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    public String getContrasena() {
        return contrasena;
    }
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public Boolean getActivo() {
    return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

}
