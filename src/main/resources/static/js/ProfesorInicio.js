document.addEventListener('DOMContentLoaded', function () {
  // Referencias DOM
  const mainContent = document.getElementById("main-content");
  const tituloSeccion = document.getElementById("tituloSeccion");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");

  // --- Estado global ---
  let profesorGlobal = { id: null, nombre: "" };


  // ----------------------------
  // Helpers de fecha
  // ----------------------------
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
// LISTAR TAREAS
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
// EDITAR Y ELIMINAR
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
// CARGAR CURSOS EN SELECT
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



  function cargarPerfilVista() {
    mainContent.innerHTML = "<h1>Perfil</h1><p>Cargando...</p>";
    loadPerfil().then(usuario => {
      if (!usuario) {
        mainContent.innerHTML = "<h1>Perfil</h1><p>❌ No se pudo cargar el perfil</p>";
        return;
      }
      mainContent.innerHTML = `
        <div style="max-width:500px; margin:0 auto; background:white; padding:20px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1); text-align:center;">
          <img src="icons/3106807.png" alt="Foto perfil" style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin-bottom:15px;">
          <h2>${usuario.nombre} ${usuario.apellido}</h2>
          <p><strong>Correo:</strong> ${usuario.email}</p>
          <p><strong>Cargo:</strong> ${usuario.cargo}</p>
          <button onclick="alert('Aquí luego implementamos subir foto')">Cambiar foto</button>
        </div>
      `;
    });
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
    <h1 style="text-align:center; color:#1e3a8a; margin-bottom:20px;"> Estudiantes</h1>
    <div id="estudiantesContainer" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:20px;"></div>
  `;

  fetch("http://localhost:8080/api/usuario")
    .then(r => r.json())
    .then(data => {
      const container = document.getElementById("estudiantesContainer");
      container.innerHTML = "";

      const estudiantes = data.filter(u => u.cargo.toLowerCase() === "estudiante");

      if (estudiantes.length === 0) {
        container.innerHTML = `<p style="grid-column:1/-1; text-align:center;">⚠️ No hay estudiantes registrados</p>`;
        return;
      }

      estudiantes.forEach(u => {
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
      document.querySelectorAll("#estudiantesContainer > div").forEach(card => {
        card.addEventListener("mouseenter", () => card.style.transform = "scale(1.05)");
        card.addEventListener("mouseleave", () => card.style.transform = "scale(1)");
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("estudiantesContainer").innerHTML = `
        <p style="grid-column:1/-1; text-align:center; color:red;">❌ Error al cargar estudiantes</p>
      `;
    });
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
  console.log("Curso seleccionado:", idCurso, nombreCurso);

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

  // Animación del loader
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .card-entrega:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
    .btn-guardar:hover { background: linear-gradient(90deg, #1d4ed8, #3b82f6); }
    .nota-input:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.2); outline:none; }
  `;
  document.head.appendChild(style);

  fetch(`http://localhost:8080/api/entregas/curso/${idCurso}/tareas`)
    .then(res => {
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      return res.json();
    })
    .then(entregas => {
      if (!Array.isArray(entregas) || entregas.length === 0) {
        detalleDiv.innerHTML = `
          <h2 style="font-size:1.8rem; color:#1e40af;">📘 ${nombreCurso}</h2>
          <p style="color:#6b7280; text-align:center; margin-top:10px;">No hay entregas registradas todavía.</p>
        `;
        return;
      }

      let html = `
        <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(310px,1fr)); gap:20px;">
      `;

      entregas.forEach(e => {
        const idEntrega = e.idEntrega;
        const nombreTarea = e.nombreTarea;
        const idUsuario = e.idUsuario;
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

            <p style="margin:10px 0 6px; color:#374151;">👤 <strong>Alumno ${idUsuario}</strong></p>
            <p style="margin:0 0 12px; color:#6b7280;">📅 ${fechaEntrega}</p>

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

      detalleDiv.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <h2 style="font-size:1.9rem; color:#1e40af;">📘 ${nombreCurso}</h2>
        </div>
        <p style="color:#6b7280; margin-bottom:20px;">Haz clic en una nota para editarla y presiona "Guardar calificación".</p>
        ${html}
      `;

      // Guardar calificaciones
      detalleDiv.querySelectorAll(".btn-guardar").forEach(btn => {
        btn.addEventListener("click", () => {
          const entregaId = btn.dataset.id;
          const inputNota = document.getElementById(`nota-${entregaId}`);
          const nuevaNota = Number(inputNota.value);

          if (isNaN(nuevaNota) || nuevaNota < 0 || nuevaNota > 100) {
            alert("⚠️ Ingresa una nota válida entre 0 y 100");
            return;
          }

          fetch(`http://localhost:8080/api/entregas/calificar/${entregaId}?calificacion=${nuevaNota}`, {
            method: "PUT"
          })
          .then(res => {
            if (res.ok) {
              inputNota.style.border = "2px solid #22c55e";
              setTimeout(() => inputNota.style.border = "1px solid #d1d5db", 1500);
              alert("✅ Calificación actualizada correctamente");
            } else {
              alert(`❌ Error al actualizar (HTTP ${res.status})`);
            }
          })
          .catch(err => {
            console.error(err);
            alert("⚠️ Error de conexión al guardar calificación");
          });
        });
      });
    })
    .catch(err => {
      console.error("Error al cargar entregas:", err);
      detalleDiv.innerHTML = `
        <h2 style="font-size:1.8rem; color:#1e40af;">📘 ${nombreCurso}</h2>
        <p style="color:red;">❌ Error al cargar calificaciones.</p>
      `;
    });
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


function cargarComentarios(foroId, container) {
  container.innerHTML = "<p style='color:#6b7280;'>Cargando comentarios...</p>";

  fetch(`http://localhost:8080/api/comentarios/foro/${foroId}`)
    .then(resp => resp.json())
    .then(data => {
      container.innerHTML = "";
      if (!data || data.length === 0) {
        container.innerHTML = "<p style='color:#9ca3af;'>Aún no hay comentarios 💬</p>";
        return;
      }

      data.forEach(c => {
        const div = document.createElement("div");
        div.className = "comentario-card";
        div.style.cssText = `
          background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px;
          padding:10px 14px; margin-bottom:10px;
        `;
        div.innerHTML = `
          <strong style="color:#1e3a8a;">👤 ${c.usuarioNombre || "Usuario " + c.usuarioId}</strong>
          <span style="font-size:0.85em; color:#6b7280; float:right;">
            ${new Date(c.fecha).toLocaleString()}
          </span>
          <p class="contenido-comentario" style="margin-top:6px;">${c.contenido}</p>
          ${
            c.usuarioId === profesorGlobal.id
              ? `<button class="btn-editar" data-id="${c.idComentario}" style="background:#f59e0b; color:white; border:none; border-radius:6px; padding:3px 8px; margin-right:4px;">✏️</button>
                 <button class="btn-eliminar" data-id="${c.idComentario}" style="background:#dc2626; color:white; border:none; border-radius:6px; padding:3px 8px;">🗑️</button>`
              : ""
          }
        `;

        container.appendChild(div);
      });

      // --- Acciones ---
      container.querySelectorAll(".btn-editar").forEach(btn =>
        btn.addEventListener("click", () =>
          editarComentario(btn.dataset.id, foroId, container)
        )
      );
      container.querySelectorAll(".btn-eliminar").forEach(btn =>
        btn.addEventListener("click", () =>
          eliminarComentario(btn.dataset.id, foroId, container)
        )
      );
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
    });
}

function editarComentario(id, foroId, container) {
  const nuevo = prompt("✏️ Edita tu comentario:");
  if (!nuevo || !nuevo.trim()) return;

  fetch(`http://localhost:8080/api/comentarios/${id}/usuario/${profesorGlobal.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenido: nuevo.trim() })
  })
    .then(resp => {
      if (!resp.ok) throw new Error("No autorizado o error en servidor");
      mostrarNotificacion("✅ Comentario editado", "exito");
      cargarComentarios(foroId, container);
    })
    .catch(err => mostrarNotificacion("❌ " + err.message, "error"));
}

function eliminarComentario(id, foroId, container) {
  if (!confirm("¿Eliminar este comentario?")) return;

  fetch(`http://localhost:8080/api/comentarios/${id}/usuario/${profesorGlobal.id}`, {
    method: "DELETE"
  })
    .then(resp => {
      if (!resp.ok) throw new Error("Error al eliminar comentario");
      mostrarNotificacion("🗑️ Comentario eliminado", "exito");
      cargarComentarios(foroId, container);
    })
    .catch(err => mostrarNotificacion("❌ " + err.message, "error"));
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
