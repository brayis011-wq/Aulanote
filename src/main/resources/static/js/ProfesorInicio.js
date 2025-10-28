document.addEventListener('DOMContentLoaded', function () {
  // Referencias DOM
  const mainContent = document.getElementById("main-content");
  const tituloSeccion = document.getElementById("tituloSeccion");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");

  // --- Estado global ---
  let profesorGlobal = { id: null, nombre: "" };


 
  function toInputDatetimeLocal(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  function prettyDate(isoString) {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return isoString;
    }
  }

  
  async function loadPerfil() {
    try {
      const resp = await fetch("/api/usuario/perfil");
      if (!resp.ok) throw new Error("No hay usuario en sesión");
      const usuario = await resp.json();
      profesorGlobal.id = usuario.id;
      profesorGlobal.nombre = `${usuario.nombre} ${usuario.apellido}`;
      console.log("Perfil cargado:", profesorGlobal);
      // actualizar saludo si está visible
      const bienvenidaEl = document.querySelector('.bienvenida');
      if (bienvenidaEl) bienvenidaEl.textContent = `Bienvenido ${profesorGlobal.nombre} 👋`;
      return usuario;
    } catch (err) {
      console.error("Error cargando perfil:", err);
      // dejamos profesorGlobal con valores por defecto
      profesorGlobal.id = null;
      profesorGlobal.nombre = "Profesor";
      return null;
    }
  }
 const idProfesor = localStorage.getItem("idUsuario") || 1; 


document.getElementById("btn-mensajes").addEventListener("click", async () => {
  mostrarModalMensajes();
  await cargarMensajesRecibidos(idProfesor);
});


function mostrarModalMensajes() {
  let modal = document.getElementById("modalMensajes");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modalMensajes";
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <h2>📩 Mensajes Recibidos</h2>
        <div id="listaMensajes" style="max-height:300px; overflow-y:auto; margin-top:10px;">
          <p>Cargando mensajes...</p>
        </div>
        <button id="cerrarModalMensajes" class="btn-cerrar">Cerrar</button>
      </div>
    `;
    document.body.appendChild(modal);

  
    const style = document.createElement("style");
    style.innerHTML = `
      #modalMensajes {
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
  document.getElementById("cerrarModalMensajes").onclick = () => {
    modal.style.display = "none";
  };
}


async function cargarMensajesRecibidos(idUsuario) {
  const lista = document.getElementById("listaMensajes");
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
      <h1 class="bienvenida">Bienvenido ${profesorGlobal.nombre || "Profesor"} 👋</h1>
      <div id="calendar"></div>
    `;
    const calendarEl = document.getElementById('calendar');
    if (calendarEl && typeof FullCalendar !== "undefined") {
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }
      });
      calendar.render();
    }
  }

  
let editingTareaId = null; 
async function cargarCrearTareas(tareaToEdit = null) {
  editingTareaId = tareaToEdit ? tareaToEdit.id : null;

  mainContent.innerHTML = `
    <div class="card">
      <h2>${editingTareaId ? "Editar Tarea" : "Crear Nueva Tarea"}</h2>
      <form id="formCrearTarea" class="formulario">
        <div class="form-group">
          <label for="nombreActividad">Nombre de la Actividad</label>
          <input type="text" id="nombreActividad" required>
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" rows="4" required></textarea>
        </div>

        <div class="form-group">
          <label for="fechaLimite">Fecha Límite</label>
          <input type="datetime-local" id="fechaLimite" required>
        </div>

        <div class="form-group">
          <label for="cursoId">Curso</label>
          <select id="cursoId" required>
            <option value="">-- Selecciona un curso --</option>
          </select>
        </div>

        <div class="form-group">
          <label for="profesor">Profesor</label>
          <input type="text" id="profesor" value="${profesorGlobal.nombre}" readonly>
        </div>

        <div style="display:flex; gap:8px; margin-top:12px;">
          <button type="submit" class="btn-primary">${editingTareaId ? "Actualizar" : "Crear"}</button>
          <button type="button" id="btn-cancelar" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Contenedor de lista -->
    <div id="listaTareasContainer"></div>
  `;

  await cargarCursosSelect();

  // precargar valores si estamos editando
  if (tareaToEdit) {
    document.getElementById("nombreActividad").value = tareaToEdit.nombreActividad || "";
    document.getElementById("descripcion").value = tareaToEdit.descripcion || "";
    document.getElementById("fechaLimite").value = tareaToEdit.fechaLimite
      ? toInputDatetimeLocal(tareaToEdit.fechaLimite)
      : "";
    document.getElementById("cursoId").value = tareaToEdit.curso ? tareaToEdit.curso.idCurso : "";
  }

  // cancelar vuelve a la lista
  document.getElementById("btn-cancelar").addEventListener("click", () => {
    editingTareaId = null;
    document.getElementById("formCrearTarea").reset();
    cargarListaTareas();
  });

  // submit del formulario
  const form = document.getElementById("formCrearTarea");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      nombreActividad: document.getElementById("nombreActividad").value,
      descripcion: document.getElementById("descripcion").value,
      fechaLimite: document.getElementById("fechaLimite").value,
      profesorId: profesorGlobal.id,
      curso: { idCurso: parseInt(document.getElementById("cursoId").value) }
    };

    try {
      let resp;
      if (editingTareaId) {
        resp = await fetch(`/api/tareas/actualizar/${editingTareaId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        resp = await fetch("/api/tareas/crear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (resp.ok) {
        alert(editingTareaId ? "✅ Tarea actualizada" : "✅ Tarea creada");
        editingTareaId = null;
        form.reset();
        cargarListaTareas();
      } else {
        console.error(await resp.text());
        alert("❌ Error al guardar la tarea");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error de conexión con el servidor");
    }
  });

  cargarListaTareas("mias");
}

async function cargarListaTareas(filtro = "mias") {
  const container = document.getElementById("listaTareasContainer");
  if (!container) return;

  container.innerHTML = `
    <div class="card" style="margin-top:16px;">
      <h2>${filtro === "todas" ? "Todas las Tareas" : "Mis Tareas"}</h2>
      <div style="margin-bottom:10px; display:flex; gap:8px;">
        <button id="btn-misTareas" class="btn-secondary">Mis tareas</button>
        <button id="btn-todasTareas" class="btn-secondary">Todas</button>
      </div>
      <div style="overflow:auto;">
        <table class="tabla-tareas" style="width:100%;">
          <thead>
            <tr>
              <th>ID</th>
              <th>Actividad</th>
              <th>Descripción</th>
              <th>Fecha Límite</th>
              <th>Curso</th>
              <th>Profesor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="tbodyTareas">
            <tr><td colspan="7">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("btn-misTareas").addEventListener("click", () => cargarListaTareas("mias"));
  document.getElementById("btn-todasTareas").addEventListener("click", () => cargarListaTareas("todas"));

  let url = filtro === "todas" ? "/api/tareas" : `/api/tareas/profesor/${profesorGlobal.id}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Error al cargar tareas");
    const tareas = await resp.json();

    const tbody = document.getElementById("tbodyTareas");
    if (!tareas || tareas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">📌 No hay tareas para mostrar</td></tr>`;
      return;
    }

    // Renderizar todas las tareas
    tbody.innerHTML = tareas.map(t => {
      const acciones = (t.profesorId === profesorGlobal.id) ? `
        <button class="btn-accion editar" data-id="${t.id}">✏️</button>
        <button class="btn-accion eliminar" data-id="${t.id}">🗑️</button>
      ` : "";

      // Si usas DTO plano, curso puede venir con idCurso y nombreCurso
      const cursoNombre = t.nombreCurso || (t.curso ? t.curso.nombre : "—");

      return `
        <tr>
          <td>${t.id}</td>
          <td>${t.nombreActividad}</td>
          <td>${t.descripcion}</td>
          <td>${t.fechaLimite ? prettyDate(t.fechaLimite) : ""}</td>
          <td>${cursoNombre}</td>
          <td>Profesor ${t.profesorId}</td>
          <td>${acciones}</td>
        </tr>
      `;
    }).join("");

    // Asociar eventos a botones
    document.querySelectorAll('.btn-accion.editar').forEach(btn =>
      btn.addEventListener('click', () => editarTarea(parseInt(btn.dataset.id)))
    );
    document.querySelectorAll('.btn-accion.eliminar').forEach(btn =>
      btn.addEventListener('click', () => eliminarTarea(parseInt(btn.dataset.id)))
    );

  } catch (err) {
    console.error(err);
    document.getElementById("tbodyTareas").innerHTML = `<tr><td colspan="7">⚠️ Error al cargar las tareas</td></tr>`;
  }
}

async function editarTarea(id) {
  try {
    const resp = await fetch(`/api/tareas/buscar/${id}`);
    if (!resp.ok) throw new Error("No encontrada");
    const tarea = await resp.json();

    if (tarea.profesorId !== profesorGlobal.id) {
      alert("❌ No puedes editar esta tarea, no es tuya.");
      return;
    }
    cargarCrearTareas(tarea);
  } catch (err) {
    console.error(err);
    alert("⚠️ No se pudo cargar la tarea para editar");
  }
}
async function eliminarTarea(id) {
  if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;
  try {
    const resp = await fetch(`/api/tareas/eliminar/${id}/${profesorGlobal.id}`, { method: "DELETE" });
    if (resp.ok) {
      alert("✅ Tarea eliminada");
      cargarListaTareas();
    } else {
      console.error(await resp.text());
      alert("❌ Error al eliminar la tarea");
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Error de conexión al eliminar");
  }
}

async function cargarCursosSelect() {
  if (!profesorGlobal?.id) {
    console.error("No se encontró el ID del profesor");
    return;
  }

  try {
    const resp = await fetch(`/api/curso/profesor/${profesorGlobal.id}`);
    if (!resp.ok) throw new Error("No se pudieron cargar cursos");
    const cursos = await resp.json();

    const select = document.getElementById("cursoId");
    if (!select) return;

    select.innerHTML = '<option value="">-- Selecciona un curso --</option>';
    cursos.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.idCurso;
      opt.textContent = c.nombre;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Error al cargar cursos", err);
  }
}



async function cargarPerfilVista() {
  mainContent.innerHTML = "<h1 style='text-align:center; color:#1e3a8a;'>Perfil</h1><p style='text-align:center;'>Cargando...</p>";

  const usuario = await loadPerfil();
  if (!usuario) {
    mainContent.innerHTML = "<h1 style='text-align:center; color:#1e3a8a;'>Perfil</h1><p style='text-align:center; color:red;'>❌ No se pudo cargar el perfil</p>";
    return;
  }

  // Cargar cursos del profesor
  let cursosHTML = "<p>Cargando cursos...</p>";
  let cursos = [];
  try {
    const resp = await fetch(`/api/curso/profesor/${usuario.id}`);
    if (!resp.ok) throw new Error("No se pudieron cargar cursos");
    cursos = await resp.json();
    if (cursos.length > 0) {
      cursosHTML = `
        <ul style="list-style:none; padding:0; margin:0;">
          ${cursos.map(c => `<li style="padding:6px 0; border-bottom:1px solid #e5e7eb;">${c.nombre}</li>`).join("")}
        </ul>
      `;
    } else {
      cursosHTML = "<p style='color:#555;'>No tienes cursos asignados</p>";
    }
  } catch (err) {
    console.error(err);
    cursosHTML = "<p style='color:red;'>❌ Error al cargar cursos</p>";
  }

  mainContent.innerHTML = `
    <div style="
      max-width:800px;
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
        <h3 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:5px;">Información del Profesor</h3>
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

        <h3 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:5px; margin-top:20px;"> Cursos Asignados</h3>
        <div style="max-height:200px; overflow-y:auto; margin-top:10px; border:1px solid #e5e7eb; border-radius:8px; padding:10px;">
          ${cursosHTML}
        </div>

        <h3 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:5px; margin-top:20px;"> Estadísticas</h3>
        <div style="display:flex; gap:15px; flex-wrap:wrap; margin-top:10px;">
          <div style="flex:1; min-width:100px; background:#3b82f6; color:white; padding:15px; border-radius:8px; text-align:center;">
            <h4 style="margin:0;">${cursos.length}</h4>
            <p style="margin:0; font-size:12px;">Cursos</p>
          </div>
          <div style="flex:1; min-width:100px; background:#10b981; color:white; padding:15px; border-radius:8px; text-align:center;">
            <h4 style="margin:0;">${usuario.estudiantes?.length || 0}</h4>
            <p style="margin:0; font-size:12px;">Estudiantes</p>
          </div>
          <div style="flex:1; min-width:100px; background:#f59e0b; color:white; padding:15px; border-radius:8px; text-align:center;">
            <h4 style="margin:0;">${usuario.tareas?.length || 0}</h4>
            <p style="margin:0; font-size:12px;">Tareas</p>
          </div>
        </div>
      </div>
    </div>
  `;
}



  function mapMenu() {
    const map = [
      { id: "btn-inicio", fn: () => { tituloSeccion.textContent = "Bienvenido Profesor 👋"; cargarCalendario(); } },
      // tu HTML actual usa "btnCrear-tareas" como botón de tareas -> carga formulario + lista
      { id: "btnCrear-tareas", fn: () => { tituloSeccion.textContent = "Tareas"; cargarCrearTareas(); } },
      // por si cambiaste a "btn-tareas" en algún momento
      { id: "btn-tareas", fn: () => { tituloSeccion.textContent = "Tareas"; cargarCrearTareas(); } },
      { id: "btn-foros", fn: () => { tituloSeccion.textContent = "Foros"; cargarForosProfesor(); } },
      { id: "btn-perfil", fn: () => { tituloSeccion.textContent = "Perfil"; cargarPerfilVista(); } },
      { id: "btn-estudiantes", fn: () => { tituloSeccion.textContent = "Estudiantes"; cargarestudiantes(); } },
      { id: "btn-calificaciones", fn: () => { tituloSeccion.textContent = "Calificaciones"; cargarCalificaciones(); } },
      { id: "btn-cursos", fn: () => { tituloSeccion.textContent = "Cursos"; cargarCursos(); } }
    ];

    map.forEach(m => {
      const el = document.getElementById(m.id);
      if (el) {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          // marcar activo en sidebar
          document.querySelectorAll(".menu a").forEach(a => a.classList.remove("selected"));
          el.classList.add("selected");
          // ejecutar función
          m.fn();
        });
      }
    });
  }

  
  
function cargarestudiantes() {
  mainContent.innerHTML = `
    <h1 style="text-align:center; color:#1e3a8a; margin-bottom:20px;">Estudiantes</h1>
    <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
      <input type="text" id="inputBuscarEstudiante" placeholder="Buscar por nombre o apellido..." 
        style="width:100%; max-width:400px; padding:10px; border:1px solid #d1d5db; border-radius:8px; font-size:14px;">
      <button id="btnExportarXLSX" class="btn-primary">📥 Exportar XLSX</button>
    </div>
    <div style="overflow-x:auto;">
      <table id="tablaEstudiantes" class="tabla-tareas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody id="estudiantesContainer"></tbody>
      </table>
    </div>
  `;

  fetch("http://localhost:8080/api/usuario")
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById("estudiantesContainer");
      let estudiantes = data.filter(u => u.cargo.toLowerCase() === "estudiante");

      function mostrarEstudiantes(lista) {
        container.innerHTML = "";
        if (lista.length === 0) {
          container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:10px;">⚠️ No hay estudiantes que coincidan</td></tr>`;
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

      mostrarEstudiantes(estudiantes);

      // Filtrar estudiantes en tiempo real
      document.getElementById("inputBuscarEstudiante").addEventListener("input", e => {
        const texto = e.target.value.toLowerCase();
        const filtrados = estudiantes.filter(u =>
          u.nombre.toLowerCase().includes(texto) || u.apellido.toLowerCase().includes(texto)
        );
        mostrarEstudiantes(filtrados);
      });


      // Exportar XLSX
      document.getElementById("btnExportarXLSX").addEventListener("click", () => {
        const filas = container.querySelectorAll("tr");
        if (filas.length === 0) return alert("⚠️ No hay datos para exportar");

        const wb = XLSX.utils.book_new();
        const ws_data = [["Nombre","Apellido","Email","Cargo"]];

        filas.forEach(fila => {
          const celdas = fila.querySelectorAll("td");
          if (celdas.length === 0) return;
          ws_data.push(Array.from(celdas).slice(0,4).map(td => td.textContent));
        });

        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
        XLSX.writeFile(wb, "Estudiantes.xlsx");
      });

    })
    .catch(err => {
      console.error(err);
      const container = document.getElementById("estudiantesContainer");
      container.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:10px; color:red;">❌ Error al cargar estudiantes</td></tr>`;
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

      const idRemitente = localStorage.getItem("idUsuario") || 1;

      const mensaje = {
        remitente: { id: idRemitente },
        destinatario: { id: idDestinatario },
        mensaje: texto
      };

      try {
        const res = await fetch("http://localhost:8080/api/mensajes", {
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



function cargarCalificaciones() {
  mainContent.innerHTML = `
    <h1 style="font-size:1.6rem; margin-bottom:15px;">📊 Calificaciones por Curso</h1>
    <input type="text" id="buscarCurso" placeholder="Buscar curso..." 
           style="width: 250px; padding: 6px 10px; margin-bottom: 20px; border-radius: 8px; 
                  border: 1px solid #ddd; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); transition: all 0.3s;">
    <div id="listaCursos"></div>
    <div id="detalleCalificaciones" style="margin-top:30px;"></div>
  `;

  if (!profesorGlobal.id) {
    console.error("profesorGlobal.id no definido. Asegúrate de llamar primero a loadPerfil()");
    document.getElementById("listaCursos").innerHTML = `<p style="color:red;">❌ No se pudo cargar calificaciones, profesor no identificado</p>`;
    return;
  }

  // Traer cursos del profesor
  fetch(`http://localhost:8080/api/curso/profesor/${profesorGlobal.id}`)
    .then(res => res.json())
    .then(cursos => {
      const listaDiv = document.getElementById("listaCursos");
      if (!cursos || cursos.length === 0) {
        listaDiv.innerHTML = `<p>No hay cursos asignados.</p>`;
        return;
      }

      function mostrarCursos(cursosFiltrados) {
        let html = `<ul id="ulCursos" style="list-style:none; padding:0;">`;
        cursosFiltrados.forEach(c => {
          html += `
            <li data-id="${c.idCurso}" data-nombre="${c.nombre}" 
                style="cursor:pointer; background:#fff; margin-bottom:12px; padding:14px 18px; border-radius:12px; 
                       box-shadow:0 3px 6px rgba(0,0,0,0.08); display:flex; justify-content:space-between; 
                       align-items:center; transition: all 0.3s ease; opacity:0; transform:translateY(12px);">
              <span style="font-weight:500;">${c.nombre}</span>
            </li>
          `;
        });
        html += `</ul>`;
        listaDiv.innerHTML = html;

        document.querySelectorAll("#ulCursos li").forEach((li, i) => {
          setTimeout(() => {
            li.style.opacity = 1;
            li.style.transform = 'translateY(0)';
          }, i * 50);
          li.addEventListener("click", () => verCalificacionesCurso(Number(li.dataset.id), li.dataset.nombre));
        });
      }

      mostrarCursos(cursos);

      document.getElementById("buscarCurso").addEventListener("input", e => {
        const texto = e.target.value.toLowerCase();
        const filtrados = cursos.filter(c => c.nombre.toLowerCase().includes(texto));
        mostrarCursos(filtrados);
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("listaCursos").innerHTML = `<p style="color:red;">❌ Error al cargar cursos</p>`;
    });
}



function verCalificacionesCurso(idCurso, nombreCurso) {
  const detalleDiv = document.getElementById("detalleCalificaciones");
  console.log("📘 Cargando calificaciones para curso:", idCurso, nombreCurso);

  detalleDiv.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
      <h2 style="font-size:1.9rem; color:#1e40af; font-weight:700;">📘 ${nombreCurso}</h2>
      <span style="background:#dbeafe; color:#1e40af; padding:6px 12px; border-radius:20px; font-size:0.9rem; font-weight:500;">
        Calificaciones
      </span>
    </div>
    <div style="display:flex; justify-content:center; align-items:center; gap:10px; color:#555;">
      <div class="loader" style="width:22px; height:22px; border:3px solid #ccc; border-top:3px solid #2563eb; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
      <p>Cargando entregas...</p>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .card-entrega:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
    .btn-guardar:hover { background: linear-gradient(90deg, #1d4ed8, #3b82f6); }
    .nota-input:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.2); outline:none; }
  `;
  document.head.appendChild(style);

  // 🔹 Cargar entregas desde la API
  fetch(`http://localhost:8080/api/entregas/curso/${idCurso}/tareas`)
    .then(async res => {
      console.log("📡 Respuesta del servidor:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error HTTP ${res.status}: ${errorText}`);
      }

      return res.json();
    })
    .then(entregas => {
      console.log("✅ Entregas recibidas:", entregas);

      if (!Array.isArray(entregas) || entregas.length === 0) {
        detalleDiv.innerHTML = `
          <h2 style="font-size:1.8rem; color:#1e40af;">📘 ${nombreCurso}</h2>
          <p style="color:#6b7280; text-align:center; margin-top:10px;">No hay entregas registradas todavía.</p>
        `;
        return;
      }

      let html = `<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(310px,1fr)); gap:20px;">`;

      entregas.forEach(e => {
        const idEntrega = e.idEntrega ?? "—";
        const nombreTarea = e.nombreTarea ?? "Sin nombre";
        const nombreUsuario = e.nombreUsuario || `Alumno ${e.idUsuario ?? "—"}`;
        const calificacion = e.calificacion ?? "";
        const fechaEntrega = e.fechaEntrega ? new Date(e.fechaEntrega).toLocaleString() : "No registrada";
        const progreso = calificacion ? Math.min(calificacion, 100) : 0;

        html += `
          <div class="card-entrega" style="
            background: linear-gradient(180deg, #ffffff, #f9fafb);
            border:1px solid #e5e7eb; 
            border-radius:16px; 
            padding:18px 20px; 
            box-shadow:0 4px 10px rgba(0,0,0,0.06);
            transition: all 0.3s ease;">
            
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <h3 style="color:#1e3a8a; font-size:1.1rem; margin:0;">📄 ${nombreTarea}</h3>
              <span style="background:#e0f2fe; color:#0369a1; padding:4px 10px; border-radius:10px; font-size:0.8rem;">
                ID ${idEntrega}
              </span>
            </div>

            <p style="margin:10px 0 6px; color:#374151;">👤 <strong>${nombreUsuario}</strong></p>
            <p style="margin:0 0 12px; color:#6b7280;">📅 ${fechaEntrega}</p>

            <div style="margin-bottom:10px;">
              <button class="btn-verpdf" data-id="${idEntrega}" data-nombre="${nombreTarea}"
                style="width:100%; padding:8px 0; border:none; border-radius:10px; 
                       background:#f3f4f6; color:#1e3a8a; font-weight:600; cursor:pointer; 
                       transition:background 0.3s;">
                📖 Ver PDF
              </button>
            </div>

            <div style="margin-bottom:12px;">
              <label style="font-weight:600; color:#111827;">Calificación:</label>
              <input type="number" min="0" max="100" value="${calificacion}" 
                     id="nota-${idEntrega}" 
                     class="nota-input"
                     style="margin-left:10px; width:75px; padding:6px; border:1px solid #d1d5db; border-radius:8px; text-align:center; font-weight:500; color:#111827;">
            </div>

            <div style="background:#e5e7eb; border-radius:8px; height:8px; overflow:hidden; margin-bottom:14px;">
              <div style="width:${progreso}%; height:100%; background:linear-gradient(90deg,#2563eb,#3b82f6); transition:width 0.4s;"></div>
            </div>

            <button class="btn-guardar" data-id="${idEntrega}" 
                    style="width:100%; padding:10px 0; border:none; border-radius:10px; 
                           background:linear-gradient(90deg,#3b82f6,#2563eb); 
                           color:white; font-weight:600; cursor:pointer; transition:background 0.3s;">
              💾 Guardar calificación
            </button>
          </div>
        `;
      });

      html += `</div>`;
      detalleDiv.innerHTML = html;

detalleDiv.querySelectorAll(".btn-guardar").forEach(btn => {
  btn.addEventListener("click", () => {
    const entregaId = btn.dataset.id;
    const inputNota = document.getElementById(`nota-${entregaId}`);
    const nuevaNota = Number(inputNota.value);

    // Validación 0-5
    if (isNaN(nuevaNota) || nuevaNota < 0 || nuevaNota > 5) {
      alert("⚠️ Ingresa una nota válida entre 0 y 5");
      return;
    }

    fetch(`http://localhost:8080/api/entregas/calificar/${entregaId}?calificacion=${nuevaNota}`, {
      method: "PUT"
    })
    .then(async res => {
      const text = await res.text(); // Tomamos mensaje del backend
      if (res.ok) {
        alert("✅ Calificación actualizada correctamente");
        inputNota.style.border = "2px solid #22c55e";
        setTimeout(() => inputNota.style.border = "1px solid #d1d5db", 1500);
      } else {
        alert(`❌ Error al actualizar (HTTP ${res.status}): ${text}`);
      }
    })
    .catch(err => {
      console.error("❌ Error al guardar calificación:", err);
      alert("⚠️ Error de conexión al guardar calificación");
    });
  });
});

      // --- Ver PDF ---
      detalleDiv.querySelectorAll(".btn-verpdf").forEach(btn => {
        btn.addEventListener("click", () => {
          const idEntrega = btn.dataset.id;
          const nombreTarea = btn.dataset.nombre;
          verPDFenModal(idEntrega, nombreTarea);
        });
      });
    })
    .catch(err => {
      console.error("❌ Error al cargar entregas:", err);
      detalleDiv.innerHTML = `
        <h2 style="font-size:1.8rem; color:#1e40af;">📘 ${nombreCurso}</h2>
        <p style="color:red;">❌ Error al cargar calificaciones.<br>${err.message}</p>
      `;
    });
    // ====================== 🔹 MODAL DE VISUALIZACIÓN DE PDF ======================
function verPDFenModal(idEntrega, nombreTarea) {
  const url = `http://localhost:8080/api/entregas/descargar/${idEntrega}`;

  // Eliminar modales previos
  document.querySelectorAll(".modal-overlay").forEach(el => el.remove());

  // Crear overlay del modal
  const overlay = document.createElement("div");
  overlay.classList.add("modal-overlay");
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999"
  });

  overlay.innerHTML = `
    <div style="width:90%;height:90%;background:white;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;">
      <div style="background:#1e3a8a;color:white;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;">
        <span>📄 ${nombreTarea}</span>
        <div>
          <button id="descargarPDFBtn" style="background:#10b981;border:none;color:white;padding:6px 10px;border-radius:6px;margin-right:10px;cursor:pointer;">⬇ Descargar</button>
          <button id="cerrarPDFBtn" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">✖</button>
        </div>
      </div>
      <div style="flex:1;background:#000;">
        <iframe src="${url}" style="width:100%;height:100%;border:none;" title="Vista previa PDF"></iframe>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Cerrar modal
  document.getElementById("cerrarPDFBtn").onclick = () => overlay.remove();

  // Descargar en nueva pestaña
  document.getElementById("descargarPDFBtn").onclick = () => window.open(url, "_blank");
}

}



function mostrarNotificacion(mensaje, tipo = "exito") {
  const notificacion = document.createElement("div");
  notificacion.classList.add("notificacion", tipo);
  notificacion.textContent = mensaje;

  // estilos básicos
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
    notificacion.style.backgroundColor = "#16a34a"; // verde
  } else if (tipo === "error") {
    notificacion.style.backgroundColor = "#dc2626"; // rojo
  } else {
    notificacion.style.backgroundColor = "#3b82f6"; // azul por defecto
  }

  document.body.appendChild(notificacion);

  // mostrar animado
  setTimeout(() => {
    notificacion.style.opacity = "1";
    notificacion.style.transform = "translateY(0)";
  }, 50);

  // quitar después de 3s
  setTimeout(() => {
    notificacion.style.opacity = "0";
    notificacion.style.transform = "translateY(-20px)";
    setTimeout(() => notificacion.remove(), 300);
  }, 3000);
}


function cargarForosProfesor() {
  mainContent.innerHTML = `
    <h1 style="text-align:center; color:#1e3a8a; margin-bottom:25px;">💬 Foros del Profesor</h1>

    <div id="crearForo" style="
      margin-bottom:25px; padding:20px; border:1px solid #e5e7eb;
      border-radius:12px; background:#f9fafb; box-shadow:0 1px 3px rgba(0,0,0,0.05);
    ">
      <h3 style="margin-bottom:10px;">📝 Crear nuevo foro</h3>
      <input type="text" id="tituloForo" placeholder="Título del foro" 
             style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ccc; border-radius:8px;">
      <textarea id="descripcionForo" placeholder="Descripción" 
             style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ccc; border-radius:8px;"></textarea>
      <button id="btnCrearForo" style="
        padding:10px 16px; background:#16a34a; color:white; border:none;
        border-radius:8px; cursor:pointer; font-weight:600; transition:0.2s;
      " onmouseover="this.style.background='#15803d'" onmouseout="this.style.background='#16a34a'">
        ➕ Crear Foro
      </button>
    </div>

    <div id="listaForos" style="min-height:200px; text-align:center; color:#6b7280;">Cargando foros...</div>
  `;

  const contenedor = document.getElementById("listaForos");


  document.getElementById("btnCrearForo").addEventListener("click", () => {
    const titulo = document.getElementById("tituloForo").value.trim();
    const descripcion = document.getElementById("descripcionForo").value.trim();
    if (!titulo || !descripcion)
      return mostrarNotificacion("⚠️ Completa todos los campos", "error");

    const nuevoForo = { titulo, descripcion, autorId: profesorGlobal.id };

    fetch("http://localhost:8080/api/foros/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoForo)
    })
      .then(resp => {
        if (!resp.ok) throw new Error("Error al crear foro");
        mostrarNotificacion("✅ Foro creado exitosamente", "exito");
        cargarForosProfesor();
      })
      .catch(err => mostrarNotificacion("❌ " + err.message, "error"));
  });


  fetch("http://localhost:8080/api/foros")
    .then(r => r.json())
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


        const divForo = document.createElement("div");
        divForo.classList.add("foro-card");
        divForo.style.cssText = `
          border:1px solid #e5e7eb; border-radius:12px; padding:16px;
          margin-bottom:15px; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.05);
        `;

        divForo.innerHTML = `
          <h3 class="foro-titulo" style="margin:0; color:#1e3a8a;">${titulo}</h3>
          <p class="foro-descripcion" style="color:#374151; margin:5px 0 10px;">${descripcion}</p>
          <small style="color:#6b7280;">📅 Creado el: ${fecha}</small>

          <div style="margin-top:15px;">
            <button class="btn-toggle-comentarios" style="
              padding:8px 12px; background:#3b82f6; color:white; border:none; border-radius:8px; cursor:pointer;
            ">💬 Ver comentarios</button>
          </div>

          <div class="comentarios-container" style="margin-top:15px; display:none;"></div>

          <div class="form-comentar" style="display:none; margin-top:10px; gap:10px;">
            <input type="text" class="input-comentario" placeholder="Escribe tu comentario..." 
                   style="flex:1; padding:8px; border:1px solid #ccc; border-radius:8px;">
            <button class="btn-enviar-comentario" style="
              padding:8px 12px; background:#16a34a; color:white; border:none; border-radius:8px; cursor:pointer;
            ">Enviar</button>
          </div>

          <div class="acciones-foro" style="margin-top:15px;">
            <button class="btn-editar" style="padding:8px 12px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer;">✏️ Editar</button>
            <button class="btn-eliminar" style="padding:8px 12px; background:#dc2626; color:white; border:none; border-radius:8px; cursor:pointer;">🗑️ Eliminar</button>
          </div>
        `;

        // --- Toggle comentarios ---
        const btnToggle = divForo.querySelector(".btn-toggle-comentarios");
        const comentariosContainer = divForo.querySelector(".comentarios-container");
        const formComentar = divForo.querySelector(".form-comentar");
        const inputComentario = divForo.querySelector(".input-comentario");
        const btnEnviar = divForo.querySelector(".btn-enviar-comentario");

        btnToggle.addEventListener("click", () => {
          const visible = comentariosContainer.style.display === "block";
          if (visible) {
            comentariosContainer.style.display = "none";
            formComentar.style.display = "none";
            btnToggle.textContent = "💬 Ver comentarios";
          } else {
            comentariosContainer.style.display = "block";
            formComentar.style.display = "flex";
            cargarComentarios(id, comentariosContainer);
            btnToggle.textContent = "⬆️ Ocultar comentarios";
          }
        });

        // --- Enviar comentario ---
        btnEnviar.addEventListener("click", () => {
          const contenido = inputComentario.value.trim();
          if (!contenido)
            return mostrarNotificacion("⚠️ Escribe un comentario", "error");

          const nuevoComentario = { contenido };

          fetch(`http://localhost:8080/api/comentarios/foro/${id}/usuario/${profesorGlobal.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoComentario)
          })
            .then(resp => {
              if (!resp.ok) throw new Error("Error al enviar comentario");
              inputComentario.value = "";
              mostrarNotificacion("💬 Comentario agregado", "exito");
              cargarComentarios(id, comentariosContainer);
            })
            .catch(err => mostrarNotificacion("❌ " + err.message, "error"));
        });

        // --- Editar foro ---
        const btnEditar = divForo.querySelector(".btn-editar");
        btnEditar.addEventListener("click", () => {
          const tituloEl = divForo.querySelector(".foro-titulo");
          const descEl = divForo.querySelector(".foro-descripcion");

          if (btnEditar.textContent === "✏️ Editar") {
            tituloEl.contentEditable = descEl.contentEditable = true;
            tituloEl.style.border = descEl.style.border = "1px solid #ccc";
            btnEditar.textContent = "💾 Guardar";
          } else {
            fetch(`http://localhost:8080/api/foros/${id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                titulo: tituloEl.textContent.trim(),
                descripcion: descEl.textContent.trim(),
                autorId: profesorGlobal.id
              })
            })
              .then(resp => {
                if (!resp.ok) throw new Error("Error al editar foro");
                tituloEl.contentEditable = descEl.contentEditable = false;
                tituloEl.style.border = descEl.style.border = "none";
                btnEditar.textContent = "✏️ Editar";
                mostrarNotificacion("✅ Foro actualizado", "exito");
              })
              .catch(err => mostrarNotificacion("❌ " + err.message, "error"));
          }
        });

        // --- Eliminar foro ---
        divForo.querySelector(".btn-eliminar").addEventListener("click", () => {
          if (!confirm("¿Eliminar este foro?")) return;
          fetch(`http://localhost:8080/api/foros/${id}`, { method: "DELETE" })
            .then(resp => {
              if (!resp.ok) throw new Error("Error al eliminar foro");
              mostrarNotificacion("🗑️ Foro eliminado", "exito");
              cargarForosProfesor();
            })
            .catch(err => mostrarNotificacion("❌ " + err.message, "error"));
        });

        contenedor.appendChild(divForo);
      });
    })
    .catch(err => {
      console.error(err);
      contenedor.innerHTML = "<p style='color:red;'>❌ Error al cargar los foros</p>";
    });
}


// --- Cargar comentarios ---
function cargarComentarios(foroId, contenedor) {
  contenedor.innerHTML = "<p style='color:#6b7280;'>Cargando comentarios...</p>";

  fetch(`http://localhost:8080/api/comentarios/foro/${foroId}`)
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
              c.usuarioId === profesorGlobal.id
                ? `
              <button class="btn-editar" style="padding:4px 8px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;">✏️ Editar</button>
              <button class="btn-eliminar" style="padding:4px 8px; background:#dc2626; color:white; border:none; border-radius:6px; cursor:pointer;">🗑️ Eliminar</button>
            `
                : ""
            }
          </div>

          <div class="respuestas-container" style="margin-top:8px; padding-left:15px; border-left:2px solid #e5e7eb;"></div>
        `;

        // --- Cargar respuestas ---
        const contRespuestas = divComentario.querySelector(".respuestas-container");
        cargarRespuestas(c.idComentario, contRespuestas, foroId);

        // --- Responder comentario ---
        const btnResponder = divComentario.querySelector(".btn-responder");
        btnResponder.addEventListener("click", () => {
          mostrarFormularioRespuesta(foroId, c.idComentario, contRespuestas);
        });

        // --- Editar comentario ---
        const btnEditar = divComentario.querySelector(".btn-editar");
        if (btnEditar) {
          btnEditar.addEventListener("click", () => {
            editarComentario(c.idComentario, foroId, contenedor, c.contenido);
          });
        }

        // --- Eliminar comentario ---
        const btnEliminar = divComentario.querySelector(".btn-eliminar");
        if (btnEliminar) {
          btnEliminar.addEventListener("click", () => {
            if (!confirm("¿Eliminar este comentario?")) return;

            fetch(`http://localhost:8080/api/comentarios/${c.idComentario}/usuario/${profesorGlobal.id}`, {
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
    });
}

function cargarRespuestas(comentarioPadreId, contenedor, foroId) {
  if (!contenedor) {
    console.warn(`⚠️ No se encontró el contenedor de respuestas para comentario ${comentarioPadreId}`);
    return;
  }

  fetch(`http://localhost:8080/api/comentarios/respuestas/${comentarioPadreId}`)
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
              r.usuarioId === profesorGlobal.id
                ? `
              <button class="btn-editar" style="padding:4px 8px; background:#f59e0b; color:white; border:none; border-radius:6px; cursor:pointer;">✏️ Editar</button>
              <button class="btn-eliminar" style="padding:4px 8px; background:#dc2626; color:white; border:none; border-radius:6px; cursor:pointer;">🗑️ Eliminar</button>
            `
                : ""
            }
          </div>
        `;

        // --- Evento editar ---
        const btnEditar = divResp.querySelector(".btn-editar");
        if (btnEditar) {
          btnEditar.addEventListener("click", () => {
            editarComentario(r.idComentario, foroId, contenedor, r.contenido);
          });
        }

        // --- Evento eliminar ---
        const btnEliminar = divResp.querySelector(".btn-eliminar");
        if (btnEliminar) {
          btnEliminar.addEventListener("click", () => {
            if (!confirm("¿Eliminar esta respuesta?")) return;

            fetch(`http://localhost:8080/api/comentarios/${r.idComentario}/usuario/${profesorGlobal.id}`, {
              method: "DELETE",
            })
              .then((resp) => {
                if (!resp.ok) throw new Error("Error al eliminar respuesta");

                // ✅ Eliminamos del DOM directamente
                divResp.remove();

                mostrarNotificacion("🗑️ Respuesta eliminada correctamente", "exito");
              })
              .catch((err) => mostrarNotificacion("❌ " + err.message, "error"));
          });
        }

        contenedor.appendChild(divResp);
      });
    })
    .catch((err) => console.error("Error al cargar respuestas:", err));
}



// --- Formulario de respuesta ---
function mostrarFormularioRespuesta(foroId, comentarioPadreId, contenedor) {
  // Evitar múltiples formularios abiertos
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

    fetch(`http://localhost:8080/api/comentarios/foro/${foroId}/usuario/${profesorGlobal.id}/responder/${comentarioPadreId}`, {
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

// --- Editar comentario ---
function editarComentario(idComentario, foroId, contenedor, contenidoActual) {
  const nuevoContenido = prompt("Editar comentario:", contenidoActual);
  if (!nuevoContenido) return;

  fetch(`http://localhost:8080/api/comentarios/${idComentario}/usuario/${profesorGlobal.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenido: nuevoContenido }),
  })
    .then((resp) => {
      if (!resp.ok) throw new Error("Error al editar comentario");
      mostrarNotificacion("✅ Comentario actualizado", "exito");
      cargarComentarios(foroId, contenedor);
    })
    .catch((err) => mostrarNotificacion("❌ " + err.message, "error"));
}

function enviarComentarioPrincipal(foroId, contenedor) {
  const input = document.getElementById("inputComentarioPrincipal");
  const contenido = input.value.trim();

  if (!contenido)
    return mostrarNotificacion("⚠️ Escribe un comentario", "error");

  console.log("➡️ Intentando enviar comentario:", {
    foroId,
    usuarioId: profesorGlobal.id,
    contenido,
    url: `http://localhost:8080/api/comentarios/foro/${foroId}/usuario/${profesorGlobal.id}`
  });

  const nuevoComentario = { contenido };

  fetch(`http://localhost:8080/api/comentarios/foro/${foroId}/usuario/${profesorGlobal.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoComentario),
  })
    .then(async (resp) => {
      const texto = await resp.text();
      console.log("📥 Respuesta del servidor:", resp.status, texto);
      if (!resp.ok) throw new Error(texto);
      return JSON.parse(texto);
    })
    .then(() => {
      mostrarNotificacion("💬 Comentario publicado", "exito");
      input.value = "";
      cargarComentarios(foroId, contenedor);
    })
    .catch((err) => mostrarNotificacion("❌ " + err.message, "error"));
}





function cargarCursos() {
  mainContent.innerHTML = `
    <h1 style="text-align:center; color:#1e3a8a; margin-bottom:20px;"> Mis Cursos </h1>
    <div id="cursosContainer" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;"></div>
    <div style="text-align:center; margin-top:20px;">
      <button id="btnNuevoCurso" style="padding:10px 20px; background:#16a34a; color:white; border:none; border-radius:8px; cursor:pointer;">
        ➕ Crear Nuevo Curso
      </button>
    </div>

    <!-- 🔹 Modal para estudiantes -->
    <div id="modalEstudiantes" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; 
      background:rgba(0,0,0,0.6); justify-content:center; align-items:center; z-index:1000;">
      <div style="background:white; padding:20px; border-radius:10px; max-width:500px; width:90%;">
        <h2 style="margin-bottom:15px; color:#1e3a8a;">👥 Estudiantes inscritos</h2>
        <ul id="listaEstudiantes" style="list-style:none; padding:0; margin:0;"></ul>
        <div style="text-align:right; margin-top:15px;">
          <button id="cerrarModal" style="padding:8px 12px; background:#dc2626; color:white; border:none; border-radius:8px; cursor:pointer;">Cerrar</button>
        </div>
      </div>
    </div>
  `;

  
  fetch(`http://localhost:8080/api/curso/profesor/${profesorGlobal.id}`)
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById("cursosContainer");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center;">⚠️ No tienes cursos creados aún</p>`;
        return;
      }

      data.forEach(curso => {
        const card = document.createElement("div");
        card.style = "background:white; border-radius:12px; padding:20px; box-shadow:0 4px 10px rgba(0,0,0,0.1); transition:transform .2s;";

        card.innerHTML = `
          <h2 style="color:#1e3a8a; font-size:20px; margin-bottom:10px;">${curso.nombre}</h2>
          <p style="font-size:14px; color:#444; margin-bottom:15px;">${curso.descripcion}</p>
          <p><strong>Fecha de creación:</strong> ${new Date(curso.fechaCreacion).toLocaleDateString()}</p>
          <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btnVer" style="flex:1; padding:8px 12px; background:#3b82f6; color:white; border:none; border-radius:8px; cursor:pointer;">
              📋 Ver Estudiantes
            </button>
            <button class="btnEditar" style="flex:1; padding:8px 12px; background:#f59e0b; color:white; border:none; border-radius:8px; cursor:pointer;">
              ✏️ Editar
            </button>
            <button class="btnEliminar" style="flex:1; padding:8px 12px; background:#dc2626; color:white; border:none; border-radius:8px; cursor:pointer;">
              🗑️ Eliminar
            </button>
          </div>
        `;

        // 🔹 Botón Editar
        card.querySelector(".btnEditar").addEventListener("click", () => {
          const nuevoNombre = prompt("Nuevo nombre del curso:", curso.nombre);
          const nuevaDescripcion = prompt("Nueva descripción:", curso.descripcion);

          if (nuevoNombre && nuevaDescripcion) {
            fetch(`http://localhost:8080/api/curso/actualizar/${curso.idCurso}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nombre: nuevoNombre,
                descripcion: nuevaDescripcion,
                profesor: { id: profesorGlobal.id } // mantener profesor
              })
            })
            .then(r => {
              if (!r.ok) throw new Error("❌ Error al actualizar curso");
              return r.json();
            })
            .then(() => {
              alert("✅ Curso actualizado con éxito");
              cargarCursos(); // refrescar lista
            })
            .catch(err => alert(err));
          }
        });

        // 🔹 Botón Eliminar
        card.querySelector(".btnEliminar").addEventListener("click", () => {
          if (confirm(`¿Seguro que deseas eliminar el curso "${curso.nombre}"?`)) {
            fetch(`http://localhost:8080/api/curso/eliminar/${curso.idCurso}`, { method: "DELETE" })
              .then(r => {
                if (!r.ok) throw new Error("❌ Error al eliminar curso");
                alert("🗑️ Curso eliminado correctamente");
                cargarCursos(); // refrescar lista
              })
              .catch(err => alert(err));
          }
        });

        // 🔹 Botón Ver Estudiantes (usando modal)
        card.querySelector(".btnVer").addEventListener("click", () => {
          fetch(`http://localhost:8080/api/inscripciones/curso/${curso.idCurso}/estudiantes`)
            .then(r => {
              if (!r.ok) throw new Error("❌ Error al cargar estudiantes");
              return r.json();
            })
            .then(estudiantes => {
              const lista = document.getElementById("listaEstudiantes");
              lista.innerHTML = "";

              if (estudiantes.length === 0) {
                lista.innerHTML = "<li>⚠️ No hay estudiantes inscritos</li>";
              } else {
                estudiantes.forEach(e => {
                  const li = document.createElement("li");
                  li.textContent = `${e.nombre} ${e.apellido}`;
                  li.style.padding = "5px 0";
                  lista.appendChild(li);
                });
              }

              document.getElementById("modalEstudiantes").style.display = "flex";
            })
            .catch(err => alert(err));
        });

        container.appendChild(card);
      });

      // Animación hover
      document.querySelectorAll("#cursosContainer > div").forEach(card => {
        card.addEventListener("mouseenter", () => card.style.transform = "scale(1.03)");
        card.addEventListener("mouseleave", () => card.style.transform = "scale(1)");
      });

      // 🔹 Crear nuevo curso
      document.getElementById("btnNuevoCurso").addEventListener("click", () => {
        const nombre = prompt("Nombre del curso:");
        const descripcion = prompt("Descripción del curso:");
        if (nombre && descripcion) {
          fetch("http://localhost:8080/api/curso/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre,
              descripcion,
              profesor: { id: profesorGlobal.id }
            })
          })
          .then(r => {
            if (!r.ok) throw new Error("❌ Error al crear curso");
            return r.json();
          })
          .then(() => {
            alert("✅ Curso creado con éxito");
            cargarCursos();
          })
          .catch(err => alert(err));
        }
      });

      // 🔹 Cerrar modal estudiantes
      document.getElementById("cerrarModal").addEventListener("click", () => {
        document.getElementById("modalEstudiantes").style.display = "none";
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("cursosContainer").innerHTML = `
        <p style="grid-column:1/-1; text-align:center; color:red;">❌ Error al cargar cursos</p>
      `;
    });
}







  window.cargarCrearTareas = cargarCrearTareas;
  window.cargarListaTareas = cargarListaTareas;
  window.editarTarea = editarTarea;
  window.eliminarTarea = eliminarTarea;

 
  
  // ----------------------------
  (async () => {
    await loadPerfil();
    cargarCalendario();
    mapMenu();

    // toggle sidebar
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => sidebar.classList.toggle("collapsed"));
    }

    // logout 
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("usuarioLogueado");
        window.location.href = "login.html";
      });
    }
  })();

}); 
