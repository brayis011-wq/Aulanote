const mainContent = document.getElementById("main-content");

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");
  const botones = document.querySelectorAll(".menu a");
  const inicio = document.getElementById("inicio-section");
  const usuarios = document.getElementById("usuarios-section");
  const titulo = document.getElementById("tituloSeccion");

  // 👉 Colapsar sidebar
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // 👉 Navegación
  botones.forEach(boton => {
    boton.addEventListener("click", e => {
      e.preventDefault();
      botones.forEach(b => b.classList.remove("selected"));
      boton.classList.add("selected");

      if (boton.id === "btn-inicio") {
        inicio.style.display = "block";
        usuarios.style.display = "none";
        titulo.textContent = "Panel de Administrador";
      } else if (boton.id === "btn-usuarios") {
        inicio.style.display = "none";
        usuarios.style.display = "block";
        titulo.textContent = "Gestión de Usuarios";
        cargarUsuarios();
      }
    });
  });
});

// 👉 Mostrar formulario
function mostrarFormularioUsuario() {
  const form = document.getElementById("formularioUsuario");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

//  Cargar usuarios desde backend
function cargarUsuarios() {
  fetch("http://localhost:8080/api/usuario")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tablaUsuarios").querySelector("tbody");
      tbody.innerHTML = "";
      data.forEach(usuario => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${usuario.nombre}</td>
          <td>${usuario.apellido}</td>
          <td>${usuario.email}</td>
          <td>${usuario.cargo}</td>
          <td>
            <button onclick="editarUsuario(${usuario.id})">✏️</button>
            <button onclick="eliminarUsuario(${usuario.id})">🗑️</button>
          </td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(err => console.error("Error cargando usuarios:", err));
}

//  Guardar o actualizar usuario
function guardarUsuario() {
  const id = document.getElementById("idUsuario").value;
  const usuario = {
    nombre: document.getElementById("nombreUsuario").value,
    apellido: document.getElementById("apellidoUsuario").value,
    email: document.getElementById("correoUsuario").value,
    cargo: document.getElementById("cargoUsuario").value,
    contrasena: document.getElementById("contrasenaUsuario").value 
  };

  if (!usuario.nombre || !usuario.apellido || !usuario.email || !usuario.cargo || !usuario.contrasena) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (id) {
    //  Editar
    fetch(`http://localhost:8080/api/usuario/actualizar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    })
      .then(res => {
        if (res.ok) {
          alert("✅ Usuario actualizado");
          cargarUsuarios();
        } else {
          alert("❌ Error al actualizar");
        }
      });
  } else {
    //  Crear
    fetch("http://localhost:8080/api/usuario/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    })
      .then(res => {
        if (res.ok) {
          alert("✅ Usuario creado");
          cargarUsuarios();
        } else {
          alert("❌ Error al crear");
        }
      });
  }

  limpiarFormulario();
}

// Eliminar
function eliminarUsuario(id) {
  if (confirm("¿Seguro que deseas eliminar este usuario?")) {
    fetch(`http://localhost:8080/api/usuario/eliminar/${id}`, { method: "DELETE" })
      .then(res => {
        if (res.ok) {
          alert("🗑️ Usuario eliminado");
          cargarUsuarios();
        } else {
          alert("❌ Error al eliminar");
        }
      });
  }
}

// Editar
function editarUsuario(id) {
  fetch(`http://localhost:8080/api/usuario/buscar/${id}`)
    .then(res => res.json())
    .then(usuario => {
      document.getElementById("idUsuario").value = usuario.id;
      document.getElementById("nombreUsuario").value = usuario.nombre;
      document.getElementById("apellidoUsuario").value = usuario.apellido;
      document.getElementById("correoUsuario").value = usuario.email;
      document.getElementById("cargoUsuario").value = usuario.cargo;
      document.getElementById("contrasenaUsuario").value = usuario.contrasena; // 👈 añadido
      document.getElementById("formularioUsuario").style.display = "block";
    })
    .catch(err => console.error("Error al obtener usuario:", err));
}

//  Limpiar formulario
function limpiarFormulario() {
  document.getElementById("formularioUsuario").style.display = "none";
  document.getElementById("idUsuario").value = "";
  document.getElementById("nombreUsuario").value = "";
  document.getElementById("apellidoUsuario").value = "";
  document.getElementById("correoUsuario").value = "";
  document.getElementById("cargoUsuario").value = "";
  document.getElementById("contrasenaUsuario").value = "";
  
}
//  Cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
      e.preventDefault();
      // 👉 Aquí puedes limpiar cualquier dato del localStorage si lo usas
      localStorage.removeItem("usuarioLogueado"); 

      // Redirigir al login
      window.location.href = "login.html";
    });
  }
});
