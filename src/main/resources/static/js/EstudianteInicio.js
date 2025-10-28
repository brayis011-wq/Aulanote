
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

// Mostrar modal con los mensajes recibidos
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

// Cargar los mensajes recibidos desde el backend
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
    <h1 style="text-align:center; color:#1e3a8a; margin-bottom:20px;"> Profesores</h1>
    <div id="profesoresContainer" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:20px;"></div>
  `;

  fetch("http://localhost:8080/api/usuario")
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById("profesoresContainer");
      container.innerHTML = "";

      const profesores = data.filter(u => u.cargo.toLowerCase() === "profesor");

      if (profesores.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center;">⚠️ No hay profesores registrados</p>`;
        return;
      }

      profesores.forEach(u => {
        container.innerHTML += `
          <div style="background:white; border-radius:12px; padding:20px; box-shadow:0 4px 10px rgba(0,0,0,0.1); text-align:center; transition:transform .2s;">
            <img src="icons/profile-1335-svgrepo-com.svg" alt="Avatar" style="width:80px; height:80px; border-radius:50%; margin-bottom:10px;">
            <h2 style="color:#1e3a8a; font-size:18px; margin:5px 0;">${u.nombre} ${u.apellido}</h2>
            <p style="font-size:14px; color:#555; margin:5px 0;"><strong>Email:</strong> ${u.email}</p>
            <p style="font-size:13px; color:#888; margin:5px 0;">${u.cargo}</p>
            <button style="margin-top:10px; padding:8px 12px; background:#3b82f6; color:white; border:none; border-radius:6px; cursor:pointer;">
              Ver perfil
            </button>
          </div>
        `;
      });

      // Animación hover
      document.querySelectorAll("#profesoresContainer > div").forEach(card => {
        card.addEventListener("mouseenter", () => card.style.transform = "scale(1.05)");
        card.addEventListener("mouseleave", () => card.style.transform = "scale(1)");
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("profesoresContainer").innerHTML = `
        <p style="grid-column:1/-1; text-align:center; color:red;">❌ Error al cargar profesores</p>
      `;
    });
}
// Variable global
window.usuarioId = null; // variable global

// ------------------ Cargar tareas ------------------
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

// ------------------ Cargar lista de tareas ------------------
async function cargarListaTareas(idUsuario) {
  const container = document.getElementById("tareasContainer");

  try {
    const response = await fetch("http://localhost:8080/api/tareas");
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

// ------------------ Modal de subida ------------------
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
      const resp = await fetch(`http://localhost:8080/api/entregas/curso/${idCurso}/subir`, {
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

// ------------------ Cargar entregas del usuario ------------------
async function cargarEntregas(idUsuario) {
  const cont = document.getElementById("entregasContainer");
  cont.innerHTML = "⏳ Cargando entregas...";

  try {
    const resp = await fetch(`http://localhost:8080/api/entregas/usuario/${idUsuario}`);
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

// ------------------ Funciones globales ------------------

// ✅ Ver PDF (coincide con @GetMapping("/descargar/{id}") del backend)
function verPDF(idEntrega) {
  window.open(`http://localhost:8080/api/entregas/descargar/${idEntrega}`, "_blank");
}

// ✅ Eliminar entrega (coincide con @DeleteMapping("/{idEntrega}/eliminar"))
async function eliminarEntrega(idEntrega) {
  if (!confirm("¿Deseas eliminar esta entrega?")) return;

  try {
    const resp = await fetch(`http://localhost:8080/api/entregas/${idEntrega}/eliminar`, {
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

// ✅ Editar entrega (coincide con @PutMapping("/{idEntrega}/editar"))
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

    const resp = await fetch(`http://localhost:8080/api/entregas/${idEntrega}/editar`, {
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













function cargarForos() {
    mainContent.innerHTML = `
        <h1 style="text-align:center; color:#1e3a8a; margin-bottom:20px;">Foros</h1>
        <div id="listaForos"></div>
    `;

    const contenedor = document.getElementById("listaForos");
    contenedor.innerHTML = "<p>Cargando foros...</p>";

    fetch("http://localhost:8080/api/foros")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.json();
        })
        .then(foros => {
            contenedor.innerHTML = "";

            if (!foros || foros.length === 0) {
                contenedor.innerHTML = "<p>No hay foros creados todavía.</p>";
                return;
            }

            foros.forEach(foro => {
                const id = foro.id;
                const titulo = foro.titulo || "Sin título";
                const descripcion = foro.descripcion || "Sin descripción";
                const fecha = foro.fechaCreacion ? new Date(foro.fechaCreacion).toLocaleString() : "Sin fecha";

                // Tarjeta de foro
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
                    <div class="form-comentar" style="margin-top:10px; display:none;">
                        <input type="text" class="input-comentario" placeholder="Escribe tu comentario..." style="width:80%; padding:6px; border-radius:5px; border:1px solid #ccc;">
                        <button class="btn-enviar-comentario" style="padding:6px 10px; background:#16a34a; color:white; border:none; border-radius:5px; cursor:pointer;">Comentar</button>
                    </div>
                `;

                const btnToggle = divForo.querySelector(".btn-toggle-comentarios");
                const comentariosContainer = divForo.querySelector(".comentarios-container");
                const formComentar = divForo.querySelector(".form-comentar");
                const inputComentario = divForo.querySelector(".input-comentario");
                const btnEnviar = divForo.querySelector(".btn-enviar-comentario");

                // Alternar mostrar comentarios + formulario
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

                // Enviar comentario
                btnEnviar.addEventListener("click", () => {
                    const contenido = inputComentario.value.trim();
                    if (!contenido) return alert("Escribe un comentario");

                    const nuevoComentario = {
                        contenido: contenido,
                        foro: { id: id },
                        usuario: { id: usuarioId }
                    };

                    fetch(`http://localhost:8080/api/comentarios/foro/${id}/usuario/${usuarioId}`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                       body: JSON.stringify(contenido) // solo el texto
                      })
                    .then(resp => {
                        if (!resp.ok) throw new Error("Error al enviar comentario");
                        inputComentario.value = "";
                        cargarComentarios(id, comentariosContainer);
                    })
                    .catch(err => alert(err.message));
                });

                contenedor.appendChild(divForo);
            });
        })
        .catch(error => {
            console.error("❌ Error al cargar foros:", error);
            contenedor.innerHTML = "<p style='color:red;'>Error al cargar los foros. Revisa la consola.</p>";
        });
}


function cargarComentarios(foroId, contenedor) {
    fetch(`http://localhost:8080/api/comentarios/foro/${foroId}`)
        .then(r => r.json())
        .then(comentarios => {
            contenedor.innerHTML = "";

            if (!comentarios || comentarios.length === 0) {
                contenedor.innerHTML = "<p>No hay comentarios aún.</p>";
                return;
            }

            comentarios.forEach(c => {
                const divC = document.createElement("div");
                divC.style.borderTop = "1px solid #eee";
                divC.style.padding = "5px 0";

                const nombreUsuario = `${c.usuario?.nombre || 'Usuario'} ${c.usuario?.apellido || ''}`;

                divC.innerHTML = `
                    <strong>${nombreUsuario}:</strong>
                    <span>${c.contenido}</span>
                    <br>
                    <small>${c.fechaCreacion ? new Date(c.fechaCreacion).toLocaleString() : ''}</small>
                `;

                // Botón eliminar si es comentario del usuario logueado
                if (c.usuario?.id === usuarioId) {
                    const btnEliminar = document.createElement("button");
                    btnEliminar.textContent = "Eliminar";
                    btnEliminar.style.cssText = `
                        margin-left:10px; padding:2px 6px; background:#dc2626; color:white; border:none; border-radius:4px; cursor:pointer;
                    `;
                    btnEliminar.addEventListener("click", () => {
                        if (!confirm("¿Deseas eliminar este comentario?")) return;
                        fetch(`http://localhost:8080/api/comentarios/eliminar/${c.idComentario}`, { method: "DELETE" })
                            .then(resp => {
                                if (!resp.ok) throw new Error("Error al eliminar comentario");
                                cargarComentarios(foroId, contenedor);
                            })
                            .catch(err => alert(err.message));
                    });
                    divC.appendChild(btnEliminar);
                }

                contenedor.appendChild(divC);
            });
        })
        .catch(err => {
            console.error(err);
            contenedor.innerHTML = "<p style='color:red;'>Error al cargar comentarios</p>";
        });
}


  



let usuarioId = null; // variable global que guarda el ID del usuario

async function cargarPerfil() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = "<h1>Perfil</h1><p>Cargando...</p>";

  try {
    const resp = await fetch("http://localhost:8080/api/usuario/perfil");
    if (!resp.ok) throw new Error("Error al obtener perfil");
    const usuario = await resp.json();

    // Guardamos el ID globalmente
    window.usuarioId = usuario.id;

    mainContent.innerHTML = `
      <div style="max-width:900px; margin:0 auto; padding:20px; display:flex; flex-direction:column; gap:25px;">
        <!-- Información del perfil -->
        <div class="card" style="text-align:center;">
          <img src="icons/3106807.png" alt="Foto perfil" style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin-bottom:15px;">
          <h2>${usuario.nombre} ${usuario.apellido}</h2>
          <p><strong>Correo:</strong> ${usuario.email}</p>
          <p><strong>Cargo:</strong> ${usuario.cargo}</p>
          <button style="
              margin-top:10px; 
              padding:8px 14px; 
              border-radius:8px; 
              border:none; 
              background:#3b82f6; 
              color:white; 
              cursor:pointer; 
              transition:all 0.25s ease;" 
              onmouseover="this.style.transform='scale(1.05)'" 
              onmouseout="this.style.transform='scale(1)'"
              onclick="alert('Aquí luego implementamos subir foto')">
            Cambiar foto
          </button>
        </div>

        <!-- Indicadores de estadísticas -->
        <div style="display:flex; flex-wrap:wrap; gap:20px; justify-content:center;">
          <div class="card-tarea" style="flex:1 1 250px; text-align:center;">
            <h3>Cursos completados</h3>
            <p style="font-size:1.8rem; font-weight:700; color:#3b82f6; margin:8px 0;">7</p>
          </div>

          <div class="card-tarea" style="flex:1 1 250px; text-align:center;">
            <h3>Tareas pendientes</h3>
            <p style="font-size:1.8rem; font-weight:700; color:#3b82f6; margin:8px 0;">5</p>
          </div>

          <div class="card-tarea" style="flex:1 1 250px; text-align:center;">
            <h3>Participación en foros</h3>
            <p style="font-size:1.8rem; font-weight:700; color:#3b82f6; margin:8px 0;">12</p>
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
    <input type="text" id="buscarCurso" placeholder="Buscar curso..." 
           style="width: 250px; padding: 6px 10px; margin-bottom: 20px; border-radius: 8px; 
                  border: 1px solid #ddd; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); transition: all 0.3s;">
    <div id="listaCursos"></div>
    <div id="detalleTareas" style="margin-top:30px;"></div>
  `;

  // ✅ Usamos el ID global guardado en window
  const idUsuario = window.usuarioId;

  if (!idUsuario) {
    console.error("⚠️ usuarioId no definido. Asegúrate de que cargarPerfil() se haya ejecutado antes.");
    document.getElementById("listaCursos").innerHTML = `
      <p style="color:red;">❌ No se pudo cargar calificaciones: usuario no identificado</p>`;
    return;
  }

  // 🔹 Endpoint filtrado por usuario
  fetch(`http://localhost:8080/api/entregas/promedios/usuario/${idUsuario}`)
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

        // 🔸 Animación de aparición
        document.querySelectorAll("#ulCursos li").forEach((li, i) => {
          setTimeout(() => {
            li.style.opacity = 1;
            li.style.transform = 'translateY(0)';
          }, i * 60);
        });

        // 🔸 Click dinámico para mostrar tareas
        document.querySelectorAll("#ulCursos li").forEach(li => {
          li.addEventListener("click", () => {
            verTareasCurso(Number(li.dataset.id), li.dataset.nombre);
          });
        });
      }

      mostrarCursos(cursos);

      // 🔍 Filtrar cursos en tiempo real
      document.getElementById("buscarCurso").addEventListener("input", e => {
        const texto = e.target.value.toLowerCase();
        const filtrados = cursos.filter(c => c.curso.toLowerCase().includes(texto));
        mostrarCursos(filtrados);
      });
    })
    .catch(err => {
      console.error("❌ Error al cargar promedios:", err);
      document.getElementById("listaCursos").innerHTML = `
        <p style="color:red;">❌ Error al cargar calificaciones.<br>${err.message}</p>`;
    });
}


function verTareasCurso(idCurso, nombreCurso) {
  const detalleDiv = document.getElementById("detalleTareas");
  detalleDiv.innerHTML = `
    <h2 class="titulo-curso">📘 Tareas de ${nombreCurso}</h2>
    <p>Cargando...</p>
  `;

  const idUsuario = window.usuarioId;

  if (!idUsuario) {
    detalleDiv.innerHTML = `<p style="color:red;">❌ Usuario no identificado</p>`;
    return;
  }

  fetch(`http://localhost:8080/api/entregas/curso/${idCurso}/usuario/${idUsuario}`)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener tareas");
      return response.json();
    })
    .then(tareas => {
      if (!tareas || tareas.length === 0) {
        detalleDiv.innerHTML = `
          <h2 class="titulo-curso">📘 Tareas de ${nombreCurso}</h2>
          <p>No hay tareas registradas.</p>
        `;
        return;
      }

      let html = `<div class="grid-tareas">`;

      tareas.forEach(t => {
        html += `
          <div class="card-tarea">
            <h3>${t.titulo}</h3>
            <p>Nota: <strong>${t.calificacion ?? "Sin calificar"}</strong></p>
            <p>Fecha entrega: ${t.fechaEntrega ?? "No registrada"}</p>
          </div>
        `;
      });

      html += `</div>`;

      detalleDiv.innerHTML = `
        <h2 class="titulo-curso">📘 Tareas de ${nombreCurso}</h2>
        ${html}
      `;
    })
    .catch(err => {
      console.error("❌ Error al cargar tareas:", err);
      detalleDiv.innerHTML = `<p style="color:red;">❌ Error al cargar tareas</p>`;
    });
}



function verTareasCurso(idCurso, nombreCurso) {
  const detalleDiv = document.getElementById("detalleTareas");
  detalleDiv.innerHTML = `<h2> Tareas de ${nombreCurso}</h2><p>Cargando...</p>`;

  fetch(`http://localhost:8080/api/entregas/curso/${idCurso}/tareas?usuarioId=${usuarioId}`)
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

  fetch("http://localhost:8080/api/curso")
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
