
document.addEventListener('DOMContentLoaded', function () {
  const mainContent = document.getElementById("main-content");
  const botones = document.querySelectorAll(".menu a");

  function marcarActivo(boton) {
    botones.forEach(b => b.classList.remove("selected"));
    boton.classList.add("selected");
  }
  const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");
const tituloSeccion = document.getElementById("tituloSeccion");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  
});


document.getElementById("btn-inicio").addEventListener("click", () => {
  tituloSeccion.textContent = "Bienvenido Estudiante 👋";
});

document.getElementById("btn-foros").addEventListener("click", () => {
  tituloSeccion.textContent = "📌 Foros";
});

document.getElementById("btn-tareas").addEventListener("click", () => {
  tituloSeccion.textContent = "📝 Tareas";
});
document.getElementById("btn-profesores").addEventListener("click", () => {
  tituloSeccion.textContent = "👩‍🏫 Profesores";
});

document.getElementById("btn-calificaciones").addEventListener("click", () => {
  tituloSeccion.textContent = "📊 Calificaciones";
});

document.getElementById("btn-perfil").addEventListener("click", () => {
  tituloSeccion.textContent = "👤 Perfil";
});

document.getElementById("btn-cursos").addEventListener("click", () => {
  tituloSeccion.textContent = "📘 Cursos";
});

 

document.getElementById("btn-mensajes").addEventListener("click", async () => {
  // 🔹 Espera hasta que usuarioId esté definido
  if (!window.usuarioId) {
    alert("⚠️ No se pudo obtener el ID del usuario. Cargando perfil primero...");
    await cargarPerfil(); // Llama a cargarPerfil si no se ha cargado aún
  }

  if (!window.usuarioId) {
    alert("⚠️ Aún no se pudo obtener el ID del usuario.");
    return;
  }

  mostrarModalMensajesEstudiante();
  await cargarMensajesRecibidosEstudiante(window.usuarioId);
});


function mostrarModalMensajesEstudiante() {
  let modal = document.getElementById("modalMensajesEstudiante");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modalMensajesEstudiante";
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <h2>📩 Mis Mensajes</h2>
        <div id="listaMensajesEstudiante" style="max-height:300px; overflow-y:auto; margin-top:10px;">
          <p>Cargando mensajes...</p>
        </div>
        <button id="cerrarModalMensajesEstudiante" class="btn-cerrar">Cerrar</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Estilos del modal
    const style = document.createElement("style");
    style.innerHTML = `
      #modalMensajesEstudiante {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        z-index: 9999;
      }
      .modal-overlay {
        position: absolute; top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
      }
      .modal-content {
        position: relative;
        background: white;
        padding: 20px;
        border-radius: 10px;
        width: 400px;
        max-width: 90%;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        z-index: 10000;
      }
      .btn-cerrar {
        margin-top: 10px;
        background: #3b82f6;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 5px;
        cursor: pointer;
      }
      .mensaje-item {
        border-bottom: 1px solid #ddd;
        padding: 8px 0;
      }
      .mensaje-item small {
        color: #555;
      }
    `;
    document.head.appendChild(style);
  }

  modal.style.display = "flex";
  document.getElementById("cerrarModalMensajesEstudiante").onclick = () => {
    modal.style.display = "none";
  };
}
async function cargarMensajesRecibidosEstudiante(idUsuario) {
  const lista = document.getElementById("listaMensajesEstudiante");
  lista.innerHTML = "<p>Cargando mensajes...</p>";

  try {
    const res = await fetch(`/api/mensajes/recibidos/${idUsuario}`);
    if (!res.ok) throw new Error("Error al obtener mensajes");
    const mensajes = await res.json();

    if (mensajes.length === 0) {
      lista.innerHTML = "<p>No tienes mensajes recibidos 📭</p>";
      return;
    }

    lista.innerHTML = "";
    mensajes.forEach(m => {
      const div = document.createElement("div");
      div.classList.add("mensaje-item");
      div.innerHTML = `
        <strong>De:</strong> ${m.remitente ? m.remitente.nombre : "Usuario desconocido"}<br>
        <strong>Mensaje:</strong> ${m.mensaje}<br>
        <small>${new Date(m.fecha).toLocaleString()}</small>
      `;
      lista.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    lista.innerHTML = "<p>Error al cargar los mensajes ❌</p>";
  }
}


  function cargarCalendario() {
    mainContent.innerHTML = `
      <h1 class="bienvenida">Bienvenido Estudiante 👋</h1>
      <div id="calendar"></div>
    `;
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [
        { title: ' Examen Matemáticas', start: '2025-09-20', backgroundColor: '#2563eb' },
        { title: ' Entrega Tarea Historia', start: '2025-09-25', backgroundColor: '#3b82f6' },
        { title: ' Foro de Ciencias', start: '2025-09-28', backgroundColor: '#60a5fa' }
      ]
    });
    calendar.render();
}

  
function cargarProfesores() {
  mainContent.innerHTML = `
    <h1 style="text-align:center; color:#1e3a8a; margin-bottom:20px;">Profesores</h1>
    <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
      <input type="text" id="inputBuscarProfesor" placeholder="Buscar por nombre o apellido..." 
        style="width:100%; max-width:400px; padding:10px; border:1px solid #d1d5db; border-radius:8px; font-size:14px;">
    </div>
    <div style="overflow-x:auto;">
      <table id="tablaProfesores" class="tabla-tareas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody id="profesoresContainer"></tbody>
      </table>
    </div>
  `;

  fetch("/api/usuario")
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById("profesoresContainer");
      let profesores = data.filter(u => u.cargo.toLowerCase() === "profesor");

      function mostrarProfesores(lista) {
        container.innerHTML = "";
        if (lista.length === 0) {
          container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:10px;">⚠️ No hay profesores que coincidan</td></tr>`;
          return;
        }

        lista.forEach(u => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.apellido}</td>
            <td>${u.email}</td>
            <td>${u.cargo}</td>
            <td>
              <button class="btn-accion enviar" data-id="${u.id}" data-nombre="${u.nombre} ${u.apellido}">✉️ Enviar</button>
            </td>
          `;
          container.appendChild(row);
        });

        document.querySelectorAll(".btn-accion.enviar").forEach(btn => {
          btn.addEventListener("click", () => {
            const idDestinatario = btn.dataset.id;
            const nombreDestinatario = btn.dataset.nombre;
            mostrarModalEnviarMensaje(idDestinatario, nombreDestinatario);
          });
        });
      }

      mostrarProfesores(profesores);

      // Filtrar profesores en tiempo real
      document.getElementById("inputBuscarProfesor").addEventListener("input", e => {
        const texto = e.target.value.toLowerCase();
        const filtrados = profesores.filter(u =>
          u.nombre.toLowerCase().includes(texto) || u.apellido.toLowerCase().includes(texto)
        );
        mostrarProfesores(filtrados);
      });

    })
    .catch(err => {
      console.error(err);
      const container = document.getElementById("profesoresContainer");
      container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:10px; color:red;">❌ Error al cargar profesores</td></tr>`;
    });

  // Modal de enviar mensaje
  function mostrarModalEnviarMensaje(idDestinatario, nombreDestinatario) {
    let modal = document.getElementById("modalEnviarMensaje");
    if (modal) modal.remove();

    modal = document.createElement("div");
    modal.id = "modalEnviarMensaje";
    modal.innerHTML = `
      <div class="overlay"></div>
      <div class="modal">
        <h3>Enviar mensaje a ${nombreDestinatario}</h3>
        <textarea id="mensajeTexto" placeholder="Escribe tu mensaje aquí..." rows="4"
          style="width:100%; padding:8px; border:1px solid #d1d5db; border-radius:8px;"></textarea>
        <div style="margin-top:10px; text-align:right;">
          <button id="cancelarMensaje" class="btn-cancelar">Cancelar</button>
          <button id="enviarMensaje" class="btn-primary">Enviar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const style = document.createElement("style");
    style.innerHTML = `
      #modalEnviarMensaje {
        position: fixed; top:0; left:0; width:100%; height:100%;
        display:flex; align-items:center; justify-content:center; z-index:9999;
      }
      #modalEnviarMensaje .overlay {
        position:absolute; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.5);
      }
      #modalEnviarMensaje .modal {
        position:relative; background:white; padding:20px;
        border-radius:12px; width:400px; max-width:90%; z-index:10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
    `;
    document.head.appendChild(style);

    document.getElementById("cancelarMensaje").onclick = () => modal.remove();
    document.getElementById("enviarMensaje").onclick = async () => {
      const texto = document.getElementById("mensajeTexto").value.trim();
      if (texto === "") {
        alert("⚠️ Escribe un mensaje antes de enviarlo");
        return;
      }

      const idRemitente = localStorage.getItem("idUsuario") || 1; // estudiante que envía

      const mensaje = {
        remitente: { id: idRemitente },
        destinatario: { id: idDestinatario },
        mensaje: texto
      };

      try {
        const res = await fetch("/api/mensajes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mensaje)
        });

        if (!res.ok) throw new Error(await res.text());

        alert("✅ Mensaje enviado con éxito a " + nombreDestinatario);
        modal.remove();
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
        alert("❌ No se pudo enviar el mensaje. Revisa la consola para más detalles.");
      }
    };
  }
}




window.usuarioId = null; // variable global
async function cargarTareas() {
  const mainContent = document.getElementById("main-content");
  const idUsuario = window.usuarioId;

  if (!idUsuario) {
    mainContent.innerHTML = `
      <div style="text-align:center; padding:40px;">
        <h2 style="color:#dc2626;">⚠️ Error</h2>
        <p style="color:#666;">No se pudo identificar al usuario.</p>
        <button onclick="cargarPerfil()" style="
          padding:12px 24px; background:#2563eb; color:white; 
          border:none; border-radius:6px; cursor:pointer; margin-top:20px;">
          Cargar Perfil
        </button>
      </div>
    `;
    return;
  }

  mainContent.innerHTML = `
    <h1 style="text-align:center; color:#1e3a8a;">📘 Tareas</h1>
    <div id="tareasContainer" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-bottom:40px;"></div>

    <h2 style="text-align:center; color:#1e40af; margin-top:30px;">📂 Mis Entregas</h2>
    <div id="entregasContainer" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px; margin-top:20px;"></div>

    <!-- Modal para subir tarea -->
    <div id="modalTarea" style="
        display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.5); justify-content:center; align-items:center; z-index:1000;">
      <div style="
          background:white; border-radius:12px; padding:25px; width:600px; max-width:95%;
          box-shadow:0 12px 30px rgba(0,0,0,0.4); position:relative;">
        <span id="cerrarModal" style="
            position:absolute; top:10px; right:15px; cursor:pointer; font-size:22px; color:#666;">&times;</span>
        <div id="infoActividad" style="margin-bottom:20px;"></div>
        <h2 style="color:#1e3a8a;">📤 Subir Tarea</h2>
        <input type="text" id="nombreTareaModal" placeholder="Nombre de la tarea" style="padding:10px; margin-bottom:10px; width:100%; border-radius:6px; border:1px solid #ccc;">
        <input type="file" id="archivoTareaModal" accept=".pdf" style="margin-bottom:15px; width:100%;">
        <button id="btnSubirModal" style="padding:12px; background:#2563eb; color:white; border:none; border-radius:6px; cursor:pointer; width:100%; font-weight:bold;">Subir Tarea</button>
        <div id="mensajeEstado" style="margin-top:10px; text-align:center; color:#2563eb;"></div>
      </div>
    </div>
  `;

  await cargarListaTareas(idUsuario);
  await cargarEntregas(idUsuario);
}
async function cargarListaTareas(idUsuario) {
  await inicializarUsuario();
  const container = document.getElementById("tareasContainer");

  try {
    const response = await fetch("/api/tareas");
    if (!response.ok) throw new Error("Error al obtener tareas");
    const data = await response.json();

    if (data.length === 0) {
      container.innerHTML = `<p style="grid-column:1/-1; text-align:center;">⚠️ No hay tareas registradas</p>`;
      return;
    }

    container.innerHTML = "";
    data.forEach(t => {
      const fecha = new Date(t.fechaLimite).toLocaleString("es-CO", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      });

      const card = document.createElement("div");
      card.style.cssText = "background:white; border-radius:12px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.1);";
      card.innerHTML = `
        <h2 style="color:#1e3a8a; font-size:18px;">${t.nombreActividad}</h2>
        <p style="font-size:14px;"><strong>Curso:</strong> ${t.curso?.nombre || 'Sin curso'}</p>
        <p style="font-size:14px;"><strong>Fecha límite:</strong> ${fecha}</p>
        <p style="font-size:14px;">${t.descripcion}</p>
        <button class="btnVerMas" style="
          padding:8px 12px; background:#3b82f6; color:white; border:none; 
          border-radius:6px; cursor:pointer; margin-top:10px;">Ver/Entregar</button>
      `;
      container.appendChild(card);

      card.querySelector(".btnVerMas").addEventListener("click", () => abrirModalTarea(t, fecha, idUsuario));
    });

  } catch (err) {
    console.error("❌ Error al cargar tareas:", err);
    container.innerHTML = `<p style="color:red; text-align:center;">❌ ${err.message}</p>`;
  }
}
function abrirModalTarea(tarea, fecha, idUsuario) {
  const modal = document.getElementById("modalTarea");
  modal.style.display = "flex";

  const infoModal = document.getElementById("infoActividad");
  infoModal.innerHTML = `
    <h3 style="color:#1e3a8a;">${tarea.nombreActividad}</h3>
    <p><strong>Curso:</strong> ${tarea.curso?.nombre || 'Sin curso'}</p>
    <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
    <p><strong>Fecha límite:</strong> ${fecha}</p>
  `;

  document.getElementById("cerrarModal").onclick = () => {
    modal.style.display = "none";
    document.getElementById("nombreTareaModal").value = "";
    document.getElementById("archivoTareaModal").value = "";
  };

  const btnSubir = document.getElementById("btnSubirModal");
  btnSubir.onclick = async () => {
    const nombre = document.getElementById("nombreTareaModal").value.trim();
    const archivo = document.getElementById("archivoTareaModal").files[0];
    const mensajeEstado = document.getElementById("mensajeEstado");

    if (!nombre || !archivo) {
      mensajeEstado.textContent = "❌ Completa el nombre y selecciona un archivo PDF";
      mensajeEstado.style.color = "red";
      return;
    }

    if (archivo.type !== "application/pdf") {
      mensajeEstado.textContent = "❌ Solo se permiten archivos PDF";
      mensajeEstado.style.color = "red";
      return;
    }

    const idCurso = tarea.curso?.idCurso;
    if (!idCurso) {
      mensajeEstado.textContent = "❌ Esta tarea no tiene curso asociado";
      mensajeEstado.style.color = "red";
      return;
    }

    mensajeEstado.textContent = "⏳ Subiendo archivo...";
    mensajeEstado.style.color = "#2563eb";
    btnSubir.disabled = true;

    const formData = new FormData();
    formData.append("nombreTarea", nombre);
    formData.append("archivo", archivo);
    formData.append("idUsuario", idUsuario);

    try {
      const resp = await fetch(`/api/entregas/curso/${idCurso}/subir`, {
        method: "POST",
        body: formData
      });
      if (!resp.ok) throw new Error(await resp.text());
      mensajeEstado.textContent = "✅ Tarea subida correctamente";
      mensajeEstado.style.color = "#10b981";
      setTimeout(() => {
        modal.style.display = "none";
        cargarEntregas(idUsuario);
      }, 1500);
    } catch (err) {
      mensajeEstado.textContent = "❌ " + err.message;
      mensajeEstado.style.color = "red";
    } finally {
      btnSubir.disabled = false;
    }
  };
}
async function cargarEntregas(idUsuario) {
  const cont = document.getElementById("entregasContainer");
  cont.innerHTML = "⏳ Cargando entregas...";

  try {
    const resp = await fetch(`/api/entregas/usuario/${idUsuario}`);
    if (!resp.ok) throw new Error("Error al obtener entregas");

    const entregas = await resp.json();

    if (!entregas.length) {
      cont.innerHTML = `<p style="grid-column:1/-1; text-align:center;">⚠️ No tienes entregas registradas</p>`;
      return;
    }

    // --- Crear tabla ---
    let tablaHTML = `
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; background:white; box-shadow:0 3px 10px rgba(0,0,0,0.1); border-radius:10px;">
          <thead style="background:#1e3a8a; color:white;">
            <tr>
              <th style="padding:12px; text-align:left;">📄 Nombre Tarea</th>
              <th style="padding:12px; text-align:left;">📅 Fecha de Entrega</th>
              <th style="padding:12px; text-align:left;">⭐ Calificación</th>
              <th style="padding:12px; text-align:center;">⚙️ Acciones</th>
            </tr>
          </thead>
          <tbody>
    `;

    // 🔹 Generar filas dinámicamente
    entregas.forEach(e => {
      const fecha = new Date(e.fechaEntrega).toLocaleString("es-CO");
      tablaHTML += `
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:10px;">${e.nombreTarea}</td>
          <td style="padding:10px;">${fecha}</td>
          <td style="padding:10px;">${e.calificacion ?? 'Sin calificar'}</td>
          <td style="padding:10px; text-align:center;">
            <button class="btn-ver" data-id="${e.idEntrega}" style="background:#2563eb; color:white; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;">Ver PDF</button>
            <button class="btn-editar" data-id="${e.idEntrega}" style="background:#facc15; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;">Editar</button>
            <button class="btn-eliminar" data-id="${e.idEntrega}" style="background:#dc2626; color:white; border:none; border-radius:6px; padding:6px 10px; cursor:pointer;">Eliminar</button>
          </td>
        </tr>
      `;
    });

    tablaHTML += `
          </tbody>
        </table>
      </div>
    `;

    // Insertar la tabla completa
    cont.innerHTML = tablaHTML;

    // 🔥 Agregar eventos DESPUÉS de insertar la tabla
    cont.querySelectorAll(".btn-ver").forEach(btn =>
      btn.addEventListener("click", () => verPDF(btn.dataset.id))
    );

    cont.querySelectorAll(".btn-editar").forEach(btn =>
      btn.addEventListener("click", () => editarEntrega(btn.dataset.id))
    );

    cont.querySelectorAll(".btn-eliminar").forEach(btn =>
      btn.addEventListener("click", () => eliminarEntrega(btn.dataset.id))
    );

  } catch (err) {
    console.error("❌ Error al cargar entregas:", err);
    cont.innerHTML = `<p style="color:red; text-align:center;">❌ ${err.message}</p>`;
  }
}
function verPDF(idEntrega) {
  window.open(`/api/entregas/descargar/${idEntrega}`, "_blank");
}
async function eliminarEntrega(idEntrega) {
  if (!confirm("¿Deseas eliminar esta entrega?")) return;

  try {
    const resp = await fetch(`/api/entregas/${idEntrega}/eliminar`, {
      method: "DELETE"
    });

    const texto = await resp.text();
    if (!resp.ok) throw new Error(texto);

    alert(texto || "✅ Entrega eliminada correctamente");
    cargarEntregas(window.usuarioId);

  } catch (err) {
    alert("❌ Error al eliminar: " + err.message);
  }
}
async function editarEntrega(idEntrega) {
  const nuevoNombre = prompt("Nuevo nombre para la entrega:");
  if (!nuevoNombre) return;

  const cambiarArchivo = confirm("¿Deseas subir un nuevo archivo PDF?");
  let nuevoArchivo = null;

  if (cambiarArchivo) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";
    input.click();

    // Esperar a que el usuario elija archivo
    nuevoArchivo = await new Promise(resolve => {
      input.onchange = () => resolve(input.files[0]);
      input.oncancel = () => resolve(null);
    });
  }

  try {
    const formData = new FormData();
    formData.append("nombreTarea", nuevoNombre);
    if (nuevoArchivo) formData.append("archivo", nuevoArchivo);

    const resp = await fetch(`/api/entregas/${idEntrega}/editar`, {
      method: "PUT",
      body: formData
    });

    const texto = await resp.text();
    if (!resp.ok) throw new Error(texto);

    alert(texto || "✅ Entrega actualizada correctamente");
    cargarEntregas(window.usuarioId);

  } catch (err) {
    alert("❌ Error al editar: " + err.message);
  }
}


let usuarioId = null; // Mantener para compatibilidad


async function inicializarUsuario() {
  if (window.usuarioId) {
    console.log("✅ Usuario ya inicializado:", window.usuarioId);
    return; 
  }

  try {
    console.log("🔄 Inicializando usuario...");
    const resp = await fetch("/api/usuario/perfil");
    if (!resp.ok) throw new Error("Error al obtener perfil");
    const usuario = await resp.json();
    window.usuarioId = usuario.id;
    usuarioId = usuario.id; 
    console.log("✅ Usuario inicializado correctamente:", window.usuarioId);
  } catch (err) {
    console.error("❌ Error al inicializar usuario:", err);
    mostrarNotificacion("❌ Error al cargar usuario. Recarga la página.", "error");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Página cargada, inicializando usuario...");
  inicializarUsuario();
});

function mostrarNotificacion(mensaje, tipo = "exito") {
  const notificacion = document.createElement("div");
  notificacion.classList.add("notificacion", tipo);
  notificacion.textContent = mensaje;

  notificacion.style.position = "fixed";
  notificacion.style.top = "20px";
  notificacion.style.right = "20px";
  notificacion.style.padding = "12px 18px";
  notificacion.style.borderRadius = "8px";
  notificacion.style.color = "#fff";
  notificacion.style.fontSize = "14px";
  notificacion.style.fontWeight = "bold";
  notificacion.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
  notificacion.style.opacity = "0";
  notificacion.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  notificacion.style.zIndex = "9999";

  if (tipo === "exito") {
    notificacion.style.backgroundColor = "#16a34a";
  } else if (tipo === "error") {
    notificacion.style.backgroundColor = "#dc2626";
  } else {
    notificacion.style.backgroundColor = "#3b82f6";
  }

  document.body.appendChild(notificacion);

  setTimeout(() => {
    notificacion.style.opacity = "1";
    notificacion.style.transform = "translateY(0)";
  }, 50);

  setTimeout(() => {
    notificacion.style.opacity = "0";
    notificacion.style.transform = "translateY(-20px)";
    setTimeout(() => notificacion.remove(), 300);
  }, 3000);
}




async function cargarForos() {
  // ✅ Asegurar que el usuario esté inicializado
  await inicializarUsuario();

  mainContent.innerHTML = `
    <h1 style="text-align:center; color:#1e3a8a; margin-bottom:20px;">Foros</h1>
    <div id="listaForos"></div>
  `;

  const contenedor = document.getElementById("listaForos");
  contenedor.innerHTML = "<p>Cargando foros...</p>";

  fetch("/api/foros")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return response.json();
    })
    .then((foros) => {
      contenedor.innerHTML = "";

      if (!foros || foros.length === 0) {
        contenedor.innerHTML = "<p>No hay foros creados todavía.</p>";
        return;
      }

      foros.forEach((foro) => {
        const id = foro.id;
        const titulo = foro.titulo || "Sin título";
        const descripcion = foro.descripcion || "Sin descripción";
        const fecha = foro.fechaCreacion
          ? new Date(foro.fechaCreacion).toLocaleString()
          : "Sin fecha";

        const divForo = document.createElement("div");
        divForo.classList.add("foro-card");
        divForo.style.cssText = `
          border:1px solid #ccc; padding:15px; margin-bottom:15px;
          border-radius:10px; background:#fff;
        `;

        divForo.innerHTML = `
          <h3>${titulo}</h3>
          <p>${descripcion}</p>
          <small>Creado el: ${fecha}</small>
          <br><br>
          <button class="btn-toggle-comentarios" style="
            padding:6px 10px; background:#3b82f6; color:white; border:none; border-radius:5px;
            cursor:pointer; margin-bottom:10px;">Mostrar comentarios</button>
          <div class="comentarios-container" style="margin-top:10px; display:none;"></div>
          <div class="form-comentar" style="margin-top:10px; display:none; gap:8px;">
            <input type="text" class="input-comentario" placeholder="Escribe tu comentario..." style="
              width:80%; padding:6px; border-radius:5px; border:1px solid #ccc;">
            <button class="btn-enviar-comentario" style="
              padding:6px 10px; background:#16a34a; color:white; border:none; border-radius:5px;
              cursor:pointer;">Comentar</button>
          </div>
        `;

        const btnToggle = divForo.querySelector(".btn-toggle-comentarios");
        const comentariosContainer = divForo.querySelector(".comentarios-container");
        const formComentar = divForo.querySelector(".form-comentar");
        const inputComentario = divForo.querySelector(".input-comentario");
        const btnEnviar = divForo.querySelector(".btn-enviar-comentario");

        btnToggle.addEventListener("click", () => {
          if (comentariosContainer.style.display === "none") {
            comentariosContainer.style.display = "block";
            formComentar.style.display = "flex";
            comentariosContainer.innerHTML = "<p>Cargando comentarios...</p>";

            cargarComentarios(id, comentariosContainer);
            btnToggle.textContent = "Ocultar comentarios";
          } else {
            comentariosContainer.style.display = "none";
            formComentar.style.display = "none";
            btnToggle.textContent = "Mostrar comentarios";
          }
        });

        // ✅ Enviar comentario con window.usuarioId
        btnEnviar.addEventListener("click", async () => {
          await inicializarUsuario(); // Asegurar usuario
          
          if (!window.usuarioId) {
            return mostrarNotificacion("❌ Error: Usuario no identificado", "error");
          }

          const contenido = inputComentario.value.trim();
          if (!contenido) return mostrarNotificacion("⚠️ Escribe un comentario", "error");

          fetch(`/api/comentarios/foro/${id}/usuario/${window.usuarioId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contenido }),
          })
            .then((resp) => {
              if (!resp.ok) throw new Error("Error al enviar comentario");
              inputComentario.value = "";
              mostrarNotificacion("💬 Comentario publicado", "exito");
              cargarComentarios(id, comentariosContainer);
            })
            .catch((err) => mostrarNotificacion("❌ " + err.message, "error"));
        });

        contenedor.appendChild(divForo);
      });
    })
    .catch((error) => {
      console.error("❌ Error al cargar foros:", error);
      contenedor.innerHTML =
        "<p style='color:red;'>Error al cargar los foros. Revisa la consola.</p>";
    });
}
async function cargarComentarios(foroId, contenedor) {
  await inicializarUsuario();
  
  contenedor.innerHTML = "<p style='color:#6b7280;'>Cargando comentarios...</p>";

  fetch(`/api/comentarios/foro/${foroId}`)
    .then((r) => {
      if (!r.ok) throw new Error("Error al obtener comentarios");
      return r.json();
    })
    .then((comentarios) => {
      contenedor.innerHTML = "";

      if (!comentarios || comentarios.length === 0) {
        contenedor.innerHTML = "<p style='color:#9ca3af;'>Aún no hay comentarios 💭</p>";
        return;
      }

      comentarios.forEach((c) => {
        const divComentario = document.createElement("div");
        divComentario.classList.add("comentario");
        divComentario.style.cssText = `
          border:1px solid #e5e7eb; border-radius:8px; padding:10px; 
          margin-bottom:10px; background:#f9fafb;
        `;

        divComentario.innerHTML = `
          <p style="margin:0; color:#1e3a8a;"><strong>${c.autor}</strong></p>
          <p style="margin:5px 0;">${c.contenido}</p>
          <small style="color:#6b7280;">🕒 ${c.fecha}</small>

          <div style="margin-top:8px; display:flex; gap:10px;">
            <button class="btn-responder" style="
              padding:4px 8px; background:#3b82f6; color:white; border:none; border-radius:6px; cursor:pointer;
            ">↩️ Responder</button>

            ${
              c.usuarioId === window.usuarioId
                ? `
              <button class="btn-editar" style="padding:4px 8px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;">✏️ Editar</button>
              <button class="btn-eliminar" style="padding:4px 8px; background:#dc2626; color:white; border:none; border-radius:6px; cursor:pointer;">🗑️ Eliminar</button>
            `
                : ""
            }
          </div>

          <div class="respuestas-container" style="margin-top:8px; padding-left:15px; border-left:2px solid #e5e7eb;"></div>
        `;

        const contRespuestas = divComentario.querySelector(".respuestas-container");
        cargarRespuestas(c.idComentario, contRespuestas, foroId);

        const btnResponder = divComentario.querySelector(".btn-responder");
        btnResponder.addEventListener("click", () => {
          mostrarFormularioRespuesta(foroId, c.idComentario, contRespuestas);
        });

        const btnEditar = divComentario.querySelector(".btn-editar");
        if (btnEditar) {
          btnEditar.addEventListener("click", () => {
            editarComentario(c.idComentario, foroId, contenedor, c.contenido, null);
          });
        }

        const btnEliminar = divComentario.querySelector(".btn-eliminar");
        if (btnEliminar) {
          btnEliminar.addEventListener("click", () => {
            if (!confirm("¿Eliminar este comentario?")) return;

            fetch(`/api/comentarios/${c.idComentario}/usuario/${window.usuarioId}`, {
              method: "DELETE",
            })
              .then((resp) => {
                if (!resp.ok) throw new Error("Error al eliminar comentario");
                mostrarNotificacion("🗑️ Comentario eliminado", "exito");
                cargarComentarios(foroId, contenedor);
              })
              .catch((err) => mostrarNotificacion("❌ " + err.message, "error"));
          });
        }

        contenedor.appendChild(divComentario);
      });
    })
    .catch((err) => {
      contenedor.innerHTML = "<p style='color:red;'>❌ Error al cargar comentarios</p>";
      console.error(err);
      mostrarNotificacion("❌ Error al cargar comentarios", "error");
    });
}
function cargarRespuestas(comentarioPadreId, contenedor, foroId) {
  if (!contenedor) {
    console.warn(`⚠️ No se encontró el contenedor de respuestas para comentario ${comentarioPadreId}`);
    return;
  }

  fetch(`/api/comentarios/respuestas/${comentarioPadreId}`)
    .then((r) => {
      if (!r.ok) throw new Error("Error al cargar respuestas");
      return r.json();
    })
    .then((respuestas) => {
      if (!contenedor) return;
      contenedor.innerHTML = "";
      if (!respuestas || respuestas.length === 0) return;

      respuestas.forEach((r) => {
        const divResp = document.createElement("div");
        divResp.style.cssText = `
          background:#eef2ff; padding:8px; border-radius:6px; margin-top:5px;
        `;

        divResp.innerHTML = `
          <p style="margin:0; color:#1d4ed8;"><strong>${r.autor}</strong></p>
          <p style="margin:4px 0;">${r.contenido}</p>
          <small style="color:#6b7280;">🕒 ${r.fecha}</small>

          <div style="margin-top:6px; display:flex; gap:8px;">
            ${
              r.usuarioId === window.usuarioId
                ? `
              <button class="btn-editar" style="padding:4px 8px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;">✏️ Editar</button>
              <button class="btn-eliminar" style="padding:4px 8px; background:#dc2626; color:white; border:none; border-radius:6px; cursor:pointer;">🗑️ Eliminar</button>
            `
                : ""
            }
          </div>
        `;

        const btnEditar = divResp.querySelector(".btn-editar");
        if (btnEditar) {
          btnEditar.addEventListener("click", () => {
            editarComentario(r.idComentario, foroId, contenedor, r.contenido, comentarioPadreId);
          });
        }

        const btnEliminar = divResp.querySelector(".btn-eliminar");
        if (btnEliminar) {
          btnEliminar.addEventListener("click", () => {
            if (!confirm("¿Eliminar esta respuesta?")) return;

            fetch(`/api/comentarios/${r.idComentario}/usuario/${window.usuarioId}`, {
              method: "DELETE",
            })
              .then((resp) => {
                if (!resp.ok) throw new Error("Error al eliminar respuesta");
                divResp.remove();
                mostrarNotificacion("🗑️ Respuesta eliminada correctamente", "exito");
              })
              .catch((err) => mostrarNotificacion("❌ " + err.message, "error"));
          });
        }

        contenedor.appendChild(divResp);
      });
    })
    .catch((err) => {
      console.error("Error al cargar respuestas:", err);
      mostrarNotificacion("❌ Error al cargar respuestas", "error");
    });
}
async function mostrarFormularioRespuesta(foroId, comentarioPadreId, contenedor) {
  await inicializarUsuario();
  
  if (contenedor.querySelector(".input-respuesta")) return;

  const form = document.createElement("div");
  form.style.marginTop = "8px";
  form.innerHTML = `
    <input type="text" class="input-respuesta" placeholder="Escribe una respuesta..." 
           style="width:80%; padding:6px; border:1px solid #ccc; border-radius:6px;">
    <button class="btn-enviar-respuesta" style="
      padding:6px 10px; background:#16a34a; color:white; border:none; border-radius:6px; cursor:pointer;
    ">Enviar</button>
  `;

  const input = form.querySelector(".input-respuesta");
  const btn = form.querySelector(".btn-enviar-respuesta");

  btn.addEventListener("click", () => {
    const contenido = input.value.trim();
    if (!contenido)
      return mostrarNotificacion("⚠️ Escribe una respuesta", "error");

    const nuevaResp = { contenido };

    fetch(`/api/comentarios/foro/${foroId}/usuario/${window.usuarioId}/responder/${comentarioPadreId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaResp),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Error al enviar respuesta");
        return resp.json();
      })
      .then(() => {
        mostrarNotificacion("💬 Respuesta publicada", "exito");
        cargarRespuestas(comentarioPadreId, contenedor, foroId);
        form.remove();
      })
      .catch((err) => mostrarNotificacion("❌ " + err.message, "error"));
  });

  contenedor.appendChild(form);
}
function editarComentario(idComentario, foroId, contenedor, contenidoActual, comentarioPadreId = null) {
  const nuevoContenido = prompt("Editar comentario:", contenidoActual);
  if (!nuevoContenido) return;

  fetch(`/api/comentarios/${idComentario}/usuario/${window.usuarioId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenido: nuevoContenido }),
  })
    .then((resp) => {
      if (!resp.ok) throw new Error("Error al editar comentario");
      mostrarNotificacion("✅ Comentario actualizado", "exito");
      
      if (comentarioPadreId) {
        cargarRespuestas(comentarioPadreId, contenedor, foroId);
      } else {
        cargarComentarios(foroId, contenedor);
      }
    })
    .catch((err) => mostrarNotificacion("❌ " + err.message, "error"));
}

  

async function cargarPerfil() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = "<h1 style='text-align:center; color:#1e3a8a;'>Perfil</h1><p style='text-align:center;'>Cargando...</p>";

  try {
    
    const resp = await fetch("/api/usuario/perfil");
    if (!resp.ok) throw new Error("Error al obtener perfil");
    const usuario = await resp.json();
    window.usuarioId = usuario.id; 

    
    let cursosHTML = "<p>Cargando cursos...</p>";
    let cursos = [];
    try {
      const cursosResp = await fetch("/api/curso");
      if (!cursosResp.ok) throw new Error("No se pudieron cargar cursos");
      cursos = await cursosResp.json();

      if (cursos.length > 0) {
        cursosHTML = `
          <ul style="list-style:none; padding:0; margin:0;">
            ${cursos.map(c => `<li style="padding:6px 0; border-bottom:1px solid #e5e7eb;">${c.nombre}</li>`).join("")}
          </ul>
        `;
      } else {
        cursosHTML = "<p style='color:#555;'>No hay cursos disponibles</p>";
      }
    } catch (err) {
      console.error(err);
      cursosHTML = "<p style='color:red;'>❌ Error al cargar cursos</p>";
    }

    // Estadísticas simuladas (puedes adaptarlas si quieres)
    const cursosCompletados = 0; // Sin datos de estudiante
    const tareasPendientes = 0;
    const participacionForos = 0;

    // Render completo
    mainContent.innerHTML = `
      <div style="
        max-width:900px;
        margin:30px auto;
        background:white;
        border-radius:15px;
        box-shadow:0 10px 25px rgba(0,0,0,0.15);
        padding:30px;
        font-family: 'Arial', sans-serif;
        display:flex;
        gap:30px;
        flex-wrap:wrap;
        justify-content:center;
      ">
        <!-- Foto y botón -->
        <div style="flex:1; min-width:250px; display:flex; flex-direction:column; align-items:center; gap:15px;">
          <img src="icons/3106807.png" alt="Foto perfil" style="
            width:140px;
            height:140px;
            border-radius:50%;
            object-fit:cover;
            border:4px solid #3b82f6;
          ">
          <h2 style="margin:0; color:#1e3a8a;">${usuario.nombre} ${usuario.apellido}</h2>
          <button onclick="alert('Aquí luego implementamos subir foto')" style="
            background:#3b82f6;
            color:white;
            border:none;
            padding:10px 20px;
            border-radius:8px;
            cursor:pointer;
            font-size:14px;
            transition: all 0.2s;
          " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
            Cambiar foto
          </button>
        </div>

        <!-- Información y cursos -->
        <div style="flex:2; min-width:300px;">
          <h3 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:5px;">Información del Estudiante</h3>
          <table style="width:100%; margin-top:15px; border-collapse:collapse; font-size:14px;">
            <tr>
              <td style="padding:8px; font-weight:bold; color:#555;">Correo:</td>
              <td style="padding:8px; color:#333;">${usuario.email}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold; color:#555;">Cargo:</td>
              <td style="padding:8px; color:#333;">${usuario.cargo}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold; color:#555;">Teléfono:</td>
              <td style="padding:8px; color:#333;">${usuario.telefono || 'No registrado'}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold; color:#555;">Fecha de registro:</td>
              <td style="padding:8px; color:#333;">${new Date(usuario.fechaRegistro).toLocaleDateString()}</td>
            </tr>
          </table>

          <h3 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:5px; margin-top:20px;">Cursos Disponibles</h3>
          <div style="max-height:200px; overflow-y:auto; margin-top:10px; border:1px solid #e5e7eb; border-radius:8px; padding:10px;">
            ${cursosHTML}
          </div>

          <h3 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:5px; margin-top:20px;">Estadísticas</h3>
          <div style="display:flex; gap:15px; flex-wrap:wrap; margin-top:10px;">
            <div style="flex:1; min-width:100px; background:#3b82f6; color:white; padding:15px; border-radius:8px; text-align:center;">
              <h4 style="margin:0;">${cursosCompletados}</h4>
              <p style="margin:0; font-size:12px;">Cursos completados</p>
            </div>
            <div style="flex:1; min-width:100px; background:#10b981; color:white; padding:15px; border-radius:8px; text-align:center;">
              <h4 style="margin:0;">${tareasPendientes}</h4>
              <p style="margin:0; font-size:12px;">Tareas pendientes</p>
            </div>
            <div style="flex:1; min-width:100px; background:#f59e0b; color:white; padding:15px; border-radius:8px; text-align:center;">
              <h4 style="margin:0;">${participacionForos}</h4>
              <p style="margin:0; font-size:12px;">Participación en foros</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    mainContent.innerHTML = "<h1>Perfil</h1><p style='color:red;'>❌ Error al cargar perfil</p>";
  }
}



  
function cargarCalificaciones() {

  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = `
    <h1 style="font-size:1.6rem; margin-bottom:15px;">📊 Promedio de Calificaciones por Curso</h1>
    <div style="display:flex; gap:10px; align-items:center; margin-bottom: 20px;">
      <input type="text" id="buscarCurso" placeholder="Buscar curso..." 
             style="width: 250px; padding: 6px 10px; border-radius: 8px; 
                    border: 1px solid #ddd; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); transition: all 0.3s;">
      <button id="btnExportarXLSX" class="btn-primary">📥 Exportar XLSX</button>
    </div>
    <div id="listaCursos"></div>
    <div id="detalleTareas" style="margin-top:30px;"></div>
  `;

  const idUsuario = window.usuarioId;

  if (!idUsuario) {
    console.error("⚠️ usuarioId no definido.");
    document.getElementById("listaCursos").innerHTML = `
      <p style="color:red;">❌ No se pudo cargar calificaciones: usuario no identificado</p>`;
    return;
  }

  fetch(`/api/entregas/promedios/usuario/${idUsuario}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener promedios");
      return response.json();
    })
    .then(promedios => {
      const listaDiv = document.getElementById("listaCursos");

      if (!promedios || promedios.length === 0) {
        listaDiv.innerHTML = `<p>No hay calificaciones registradas.</p>`;
        return;
      }

      let cursos = promedios;

      function mostrarCursos(cursosFiltrados) {
        let html = `<ul id="ulCursos" style="list-style:none; padding:0;">`;
        cursosFiltrados.forEach(c => {
          html += `
            <li data-id="${c.idCurso}" data-nombre="${c.curso}"
                style="cursor:pointer; background:#fff; margin-bottom:12px; padding:14px 18px; border-radius:12px; 
                       box-shadow:0 3px 6px rgba(0,0,0,0.08); display:flex; justify-content:space-between; 
                       align-items:center; transition: all 0.3s ease; opacity:0; transform:translateY(12px);">
              <span style="font-weight:500;">${c.curso}</span>
              <strong style="color:#16a34a; font-size:1.1rem;">${parseFloat(c.promedio).toFixed(2)}</strong>
            </li>
          `;
        });
        html += `</ul>`;
        listaDiv.innerHTML = html;

        // Animación
        document.querySelectorAll("#ulCursos li").forEach((li, i) => {
          setTimeout(() => {
            li.style.opacity = 1;
            li.style.transform = 'translateY(0)';
          }, i * 60);
        });

        document.querySelectorAll("#ulCursos li").forEach(li => {
          li.addEventListener("click", () => {
            verTareasCurso(Number(li.dataset.id), li.dataset.nombre);
          });
        });
      }

      mostrarCursos(cursos);

      // Filtrar cursos en tiempo real
      document.getElementById("buscarCurso").addEventListener("input", e => {
        const texto = e.target.value.toLowerCase();
        const filtrados = cursos.filter(c => c.curso.toLowerCase().includes(texto));
        mostrarCursos(filtrados);
      });

      // ✅ Exportar XLSX
      document.getElementById("btnExportarXLSX").addEventListener("click", () => {
        if (!cursos || cursos.length === 0) return alert("⚠️ No hay datos para exportar");

        const wb = XLSX.utils.book_new();
        const ws_data = [["Curso", "Promedio"]];

        cursos.forEach(c => {
          ws_data.push([c.curso, parseFloat(c.promedio).toFixed(2)]);
        });

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Promedios");
        XLSX.writeFile(wb, "Promedios_Cursos.xlsx");
      });

    })
    .catch(err => {
      console.error("❌ Error al cargar promedios:", err);
      document.getElementById("listaCursos").innerHTML = `
        <p style="color:red;">❌ Error al cargar calificaciones.<br>${err.message}</p>`;
    });
    document.getElementById("btnExportarXLSX").addEventListener("click", () => {
  if (!cursos || cursos.length === 0) return alert("⚠️ No hay datos para exportar");

  const wb = XLSX.utils.book_new();
  const ws_data = [["Curso", "Promedio"]];

  cursos.forEach(c => {
    ws_data.push([c.curso, parseFloat(c.promedio).toFixed(2)]);
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Promedios");
  XLSX.writeFile(wb, "Promedios_Cursos.xlsx");
});

}


function verTareasCurso(idCurso, nombreCurso) {
  const detalleDiv = document.getElementById("detalleTareas");
  detalleDiv.innerHTML = `<h2> Tareas de ${nombreCurso}</h2><p>Cargando...</p>`;

  fetch(`/api/entregas/curso/${idCurso}/tareas?usuarioId=${usuarioId}`)
    .then(response => response.json())
    .then(tareas => {
      if (tareas.length === 0) {
        detalleDiv.innerHTML = `<h2> Tareas de ${nombreCurso}</h2><p>No hay tareas registradas.</p>`;
        return;
      }

      let html = `<h2> Tareas de ${nombreCurso}</h2>
                  <table id="tablaTareas">
                    <thead>
                      <tr>
                        <th>Tarea</th>
                        <th>Calificación</th>
                      </tr>
                    </thead>
                    <tbody>`;

      tareas.forEach(t => {
        html += `
          <tr>
            <td>${t.nombreTarea}</td>
            <td>${t.calificacion ?? "Sin nota"}</td>
          </tr>
        `;
      });

      html += `</tbody></table>`;
      detalleDiv.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      detalleDiv.innerHTML = `<p style="color:red;">❌ Error al cargar tareas</p>`;
    });
}



  function cargarCursos() {
     mainContent.innerHTML = `
    <h1 style="text-align:center; color:#1e3a8a; margin-bottom:20px;"> Cursos </h1>
    <div id="cursosContainer" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;"></div>
  `;

  fetch("/api/curso")
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById("cursosContainer");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center;">⚠️ No hay cursos disponibles</p>`;
        return;
      }

      data.forEach(curso => {
        container.innerHTML += `
          <div style="background:white; border-radius:12px; padding:20px; box-shadow:0 4px 10px rgba(0,0,0,0.1); transition:transform .2s;">
            <h2 style="color:#1e3a8a; font-size:20px; margin-bottom:10px;">${curso.nombre}</h2>
            <p style="font-size:14px; color:#444; margin-bottom:15px;">${curso.descripcion}</p>
            <p><strong>Profesor:</strong> ${curso.profesor?.nombre || "Desconocido"} ${curso.profesor?.apellido || ""}</p>
            <p><strong>Fecha:</strong> ${new Date(curso.fechaCreacion).toLocaleDateString()}</p>
            <button style="margin-top:15px; padding:10px 15px; background:#3b82f6; color:white; border:none; border-radius:8px; cursor:pointer;">
              Ver más
            </button>
          </div>
        `;
      });

      // Animación al pasar el mouse en las tarjetas
      document.querySelectorAll("#cursosContainer > div").forEach(card => {
        card.addEventListener("mouseenter", () => card.style.transform = "scale(1.03)");
        card.addEventListener("mouseleave", () => card.style.transform = "scale(1)");
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("cursosContainer").innerHTML = `
        <p style="grid-column:1/-1; text-align:center; color:red;">❌ Error al cargar cursos</p>
      `;
    });
  }

  // Eventos botones
  document.getElementById("btn-cursos").addEventListener("click", e => { e.preventDefault(); marcarActivo(e.target.closest("a")); cargarCursos(); });
  document.getElementById("btn-calificaciones").addEventListener("click", e => { e.preventDefault(); marcarActivo(e.target.closest("a")); cargarCalificaciones(); });
  document.getElementById("btn-inicio").addEventListener("click", e => { e.preventDefault(); marcarActivo(e.target.closest("a")); cargarCalendario(); });
  document.getElementById("btn-profesores").addEventListener("click", e => { e.preventDefault(); marcarActivo(e.target.closest("a")); cargarProfesores(); });
  document.getElementById("btn-tareas").addEventListener("click", e => { e.preventDefault(); marcarActivo(e.target.closest("a")); cargarTareas(); });
  document.getElementById("btn-foros").addEventListener("click", e => { e.preventDefault(); marcarActivo(e.target.closest("a")); cargarForos(); });
  document.getElementById("btn-perfil").addEventListener("click", e => { e.preventDefault(); marcarActivo(e.target.closest("a")); cargarPerfil(); });
  
  // Cargar calendario al inicio
  cargarCalendario();
});
// Logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
      e.preventDefault();
      
      localStorage.removeItem("usuarioLogueado"); 

      // Redirigir al login
      window.location.href = "login.html";
    });
  }
});
