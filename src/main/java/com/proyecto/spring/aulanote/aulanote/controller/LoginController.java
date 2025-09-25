package com.proyecto.spring.aulanote.aulanote.controller;

import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
public class LoginController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/login")
    public String mostrarLogin() {
        return "forward:/login.html";
    }

    @PostMapping("/login")
    public String procesarLogin(@RequestParam String correo,
                                @RequestParam String contrasena,
                                HttpSession session) {

        Optional<Usuario> usuarioOpt = usuarioService.autenticar(correo, contrasena);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // ✅ Guardamos en sesión al usuario autenticado
            session.setAttribute("usuarioLogueado", usuario);

            switch (usuario.getCargo().toLowerCase()) {
                case "admin":
                    return "redirect:/inicio-admin";
                case "estudiante":
                    return "redirect:/inicio-estudiante";
                case "profesor":
                    return "redirect:/inicio-profesor";
                default:
                    return "redirect:/login?error=Cargo no reconocido";
            }
        } else {
            return "redirect:/login?error=Credenciales inválidas";
        }
    }

    // ✅ Endpoint para consultar el usuario logueado (puede usarse en el frontend con fetch/ajax)
    @GetMapping("/api/usuario/perfil")
    @ResponseBody
    public Usuario perfilUsuario(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuarioLogueado");
        if (usuario == null) {
            throw new RuntimeException("No hay usuario en sesión");
        }
        return usuario;
    }

    @GetMapping("/inicio-estudiante")
    public String inicioEstudiante() {
        return "forward:/EstudianteInicio.html";
    }

    @GetMapping("/inicio-admin")
    public String inicioAdmin() {
        return "forward:/AdministradorInicio.html";
    }

    @GetMapping("/inicio-profesor")
    public String inicioProfesor() {
        return "forward:/ProfesorInicio.html";
    }
}
