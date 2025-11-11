package com.proyecto.spring.aulanote.aulanote.service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.proyecto.spring.aulanote.aulanote.entity.Usuario;
import com.proyecto.spring.aulanote.aulanote.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Autenticación por correo y contraseña
    public Optional<Usuario> autenticar(String correo, String contrasena) {
        return usuarioRepository.findByEmail(correo)
                .filter(usuario -> usuario.getContrasena().equals(contrasena));
    }

    // Listar todos los usuarios
public List<Usuario> listarUsuarios() {
    return usuarioRepository.findAll(); // no filtra por activo
}

    public Optional<Usuario> restaurarUsuario(int id) {
    Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
    if (usuarioOptional.isPresent()) {
        Usuario usuario = usuarioOptional.get();
        usuario.setActivo(true); // 👈 lo marcamos como activo
        usuarioRepository.save(usuario);
        return Optional.of(usuario);
    } else {
        return Optional.empty();
    }
}


    // Crear usuario nuevo
    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Obtener usuario por ID
    public Optional<Usuario> obtenerUsuarioPorId(int id) {
        return usuarioRepository.findById(id);
    }

    // Actualizar usuario
    public Optional<Usuario> actualizarUsuario(int id, Usuario usuarioDetalles) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(usuarioDetalles.getNombre());
            usuario.setApellido(usuarioDetalles.getApellido());
            usuario.setEmail(usuarioDetalles.getEmail());
            usuario.setContrasena(usuarioDetalles.getContrasena());
            usuario.setCargo(usuarioDetalles.getCargo());
            return usuarioRepository.save(usuario);
        });
    }

    // Eliminar usuario
public Boolean eliminarUsuario(int id) {
    Optional<Usuario> usuarioOptional = usuarioRepository.findById(id);
    if (usuarioOptional.isPresent()) {
        Usuario usuario = usuarioOptional.get();
        usuario.setActivo(false); // 👈 lo marcamos como inactivo
        usuarioRepository.save(usuario); // lo guardamos nuevamente
        return true;
    } else {
        return false;
    }
}

    
}
