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

// 👉 Mostrar formulario para crear usuario
function mostrarFormularioUsuario() {
  const form = document.getElementById("formularioUsuario");
  limpiarFormulario();
  form.style.display = "block";
}

// 👉 Cargar usuarios desde el backend
function cargarUsuarios() {
  fetch("/api/usuario")
    .then(res => {
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const tbody = document.getElementById("tablaUsuarios").querySelector("tbody");
      tbody.innerHTML = "";

      data.forEach(usuario => {
        const fila = document.createElement("tr");

        // Verifica si el usuario está activo o no
        const botonAccion = usuario.activo
          ? `<button onclick="editarUsuario(${usuario.id})">✏️</button>
             <button onclick="eliminarUsuario(${usuario.id})">🗑️</button>`
          : `<button onclick="restaurarUsuario(${usuario.id})">🔄 Restaurar</button>`;

        fila.innerHTML = `
          <td>${usuario.nombre}</td>
          <td>${usuario.apellido}</td>
          <td>${usuario.email}</td>
          <td>${usuario.cargo}</td>
          <td>${usuario.activo ? "✅ Activo" : "❌ Inactivo"}</td>
          <td>${botonAccion}</td>
        `;

        tbody.appendChild(fila);
      });
    })
    .catch(err => console.error("❌ Error cargando usuarios:", err));
}

// 👉 Guardar o actualizar usuario
function guardarUsuario() {
  const id = document.getElementById("idUsuario").value;
  const usuario = {
    nombre: document.getElementById("nombreUsuario").value.trim(),
    apellido: document.getElementById("apellidoUsuario").value.trim(),
    contrasena: document.getElementById("contrasenaUsuario").value.trim(),
    email: document.getElementById("correoUsuario").value.trim(), // 👈 Debe llamarse "email" porque así está en Java
    cargo: document.getElementById("cargoUsuario").value.trim()
  };

  if (!usuario.nombre || !usuario.apellido || !usuario.email || !usuario.cargo || !usuario.contrasena) {
    alert("Por favor completa todos los campos.");
    return;
  }

  const url = id
    ? `/api/usuario/actualizar/${id}`
    : "/api/usuario/crear";
  const metodo = id ? "PUT" : "POST";

  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(() => {
      alert(id ? "✅ Usuario actualizado exitosamente" : "✅ Usuario creado exitosamente");
      limpiarFormulario();
      cargarUsuarios();
    })
    .catch(err => {
      console.error("❌ Error al guardar usuario:", err);
      alert("❌ Error al guardar usuario. Revisa la consola para más detalles.");
    });
}

// 👉 Eliminar usuario
function eliminarUsuario(id) {
  if (confirm("¿Seguro que deseas eliminar este usuario?")) {
    fetch(`/api/usuario/eliminar/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        alert("🗑️ Usuario eliminado correctamente.");
        cargarUsuarios();
      })
      .catch(err => console.error("❌ Error al eliminar usuario:", err));
  }
}

// 👉 Editar usuario
function editarUsuario(id) {
  fetch(`/api/usuario/buscar/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      return res.json();
    })
    .then(usuario => {
      document.getElementById("idUsuario").value = usuario.id;
      document.getElementById("nombreUsuario").value = usuario.nombre;
      document.getElementById("apellidoUsuario").value = usuario.apellido;
      document.getElementById("correoUsuario").value = usuario.email;
      document.getElementById("cargoUsuario").value = usuario.cargo;
      document.getElementById("contrasenaUsuario").value = usuario.contrasena;
      document.getElementById("formularioUsuario").style.display = "block";
    })
    .catch(err => console.error("❌ Error al obtener usuario:", err));
}
function restaurarUsuario(id) {
  if (confirm("¿Deseas restaurar este usuario?")) {
    fetch(`/api/usuario/restaurar/${id}`, {
      method: "PUT"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al restaurar usuario");
        }
        alert("✅ Usuario restaurado correctamente");
        cargarUsuarios(); // refresca la lista
      })
      .catch(error => {
        console.error("❌ Error:", error);
        alert("❌ No se pudo restaurar el usuario");
      });
  }
}


// 👉 Limpiar formulario
function limpiarFormulario() {
  document.getElementById("formularioUsuario").style.display = "none";
  document.getElementById("idUsuario").value = "";
  document.getElementById("nombreUsuario").value = "";
  document.getElementById("apellidoUsuario").value = "";
  document.getElementById("correoUsuario").value = "";
  document.getElementById("cargoUsuario").value = "";
  document.getElementById("contrasenaUsuario").value = "";
}

// 👉 Cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("usuarioLogueado");
      window.location.href = "login.html";
    });
  }
});
