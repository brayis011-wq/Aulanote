document.addEventListener('DOMContentLoaded', function () {
  // Referencias DOM
  const mainContent = document.getElementById("main-content");
  const tituloSeccion = document.getElementById("tituloSeccion");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");

  // --- Estado global ---
  let profesorGlobal = { id: null, nombre: "" };
  let editingTareaId = null; // null => crear, number => editar

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

  // ----------------------------
  // Cargar perfil (desde sesión)
  // ----------------------------
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

  // ----------------------------
  // Calendario (FullCalendar)
  // ----------------------------
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

  // ----------------------------
  // Crear / Editar Tareas (muestra formulario + contenedor lista)
  // ----------------------------
  function cargarCrearTareas(tareaToEdit = null) {
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
            <label for="profesor">Profesor</label>
            <input type="text" id="profesor" value="${profesorGlobal.nombre}" readonly>
          </div>

          <div style="display:flex; gap:8px; margin-top:12px;">
            <button type="submit" class="btn-primary">${editingTareaId ? "Actualizar" : "Crear"}</button>
            <button type="button" id="btn-cancelar" class="btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Contenedor de lista (se rellena por cargarListaTareas) -->
      <div id="listaTareasContainer"></div>
    `;

    // Si viene tarea para editar, precargar valores
    if (tareaToEdit) {
      const nombre = tareaToEdit.nombreActividad || "";
      const desc = tareaToEdit.descripcion || "";
      const fecha = tareaToEdit.fechaLimite ? toInputDatetimeLocal(tareaToEdit.fechaLimite) : "";
      document.getElementById("nombreActividad").value = nombre;
      document.getElementById("descripcion").value = desc;
      document.getElementById("fechaLimite").value = fecha;
    }

    // Cancelar vuelve a la lista (modo crear)
    const btnCancelar = document.getElementById("btn-cancelar");
    if (btnCancelar) btnCancelar.addEventListener("click", () => {
      editingTareaId = null;
      document.getElementById("formCrearTarea").reset();
      cargarListaTareas();
    });

    // Submit del formulario (crear o actualizar)
    const form = document.getElementById("formCrearTarea");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        nombreActividad: document.getElementById("nombreActividad").value,
        descripcion: document.getElementById("descripcion").value,
        fechaLimite: document.getElementById("fechaLimite").value,
        profesorId: profesorGlobal.id
      };

      try {
        if (editingTareaId) {
          const resp = await fetch(`/api/tareas/actualizar/${editingTareaId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (resp.ok) {
            alert("✅ Tarea actualizada");
            editingTareaId = null;
            form.reset();
            cargarListaTareas();
          } else {
            console.error(await resp.text());
            alert("❌ Error al actualizar la tarea");
          }
        } else {
          const resp = await fetch("/api/tareas/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (resp.ok) {
            const nueva = await resp.json();
            alert(`✅ Tarea creada (ID: ${nueva.id})`);
            form.reset();
            cargarListaTareas();
          } else {
            console.error(await resp.text());
            alert("❌ Error al crear la tarea");
          }
        }
      } catch (err) {
        console.error(err);
        alert("⚠️ Error de conexión con el servidor");
      }
    });

    cargarListaTareas("mias");
  }

  // ----------------------------
  // Lista de Tareas (renderiza dentro de #listaTareasContainer)
  // ----------------------------
async function cargarListaTareas(filtro = "mias") {
  const container = document.getElementById("listaTareasContainer");
  if (!container) {
    console.warn("No existe #listaTareasContainer — llama primero a cargarCrearTareas()");
    return;
  }

  container.innerHTML = `
    <div class="card" style="margin-top:16px;">
      <h2>${filtro === "todas" ? "Todas las Tareas" : "Mis Tareas"}</h2>
      <div style="margin-bottom:10px; display:flex; gap:8px;">
        <button id="btn-misTareas" class="btn-secondary"> Mis tareas</button>
        <button id="btn-todasTareas" class="btn-secondary"> Todas</button>
      </div>

      <div style="overflow:auto;">
        <table class="tabla-tareas" style="width:100%;">
          <thead>
            <tr>
              <th>ID</th>
              <th>Actividad</th>
              <th>Descripción</th>
              <th>Fecha Límite</th>
              <th>Profesor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="tbodyTareas">
            <tr><td colspan="6">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Filtros
  document.getElementById("btn-misTareas").addEventListener("click", (e) => {
    cargarListaTareas("mias");
    e.target.classList.add("active");
    document.getElementById("btn-todasTareas").classList.remove("active");
  });

  document.getElementById("btn-todasTareas").addEventListener("click", (e) => {
    cargarListaTareas("todas");
    e.target.classList.add("active");
    document.getElementById("btn-misTareas").classList.remove("active");
  });

  // Si se solicita "mias" pero no tenemos id, intentamos cargar perfil
  if (filtro === "mias" && !profesorGlobal.id) {
    await loadPerfil();
    if (!profesorGlobal.id) {
      const tbody = document.getElementById("tbodyTareas");
      tbody.innerHTML = `<tr><td colspan="6">❌ No se pudo determinar el profesor (inicia sesión nuevamente)</td></tr>`;
      return;
    }
  }

  let url = filtro === "todas" ? "/api/tareas" : `/api/tareas/profesor/${profesorGlobal.id}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Error al cargar tareas");
    const tareas = await resp.json();

    const tbody = document.getElementById("tbodyTareas");
    if (!tareas || tareas.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6">📌 No hay tareas para mostrar</td></tr>`;
      return;
    }

    tbody.innerHTML = tareas.map(t => {
      // Solo permitir editar/eliminar si es dueño de la tarea
      let acciones = "";
      if (t.profesorId === profesorGlobal.id) {
        acciones = `
          <button class="btn-accion editar" data-id="${t.id}">✏️</button>
          <button class="btn-accion eliminar" data-id="${t.id}">🗑️</button>
        `;
      }
      return `
        <tr>
          <td>${t.id}</td>
          <td>${t.nombreActividad}</td>
          <td>${t.descripcion}</td>
          <td>${t.fechaLimite ? prettyDate(t.fechaLimite) : ""}</td>
          <td>${t.profesorNombre || ("Profesor " + t.profesorId)}</td>
          <td>${acciones}</td>
        </tr>
      `;
    }).join("");

    // listeners para editar/eliminar (solo si hay botones)
    document.querySelectorAll('.btn-accion.editar').forEach(btn => {
      btn.addEventListener('click', () => editarTarea(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.btn-accion.eliminar').forEach(btn => {
      btn.addEventListener('click', () => eliminarTarea(parseInt(btn.dataset.id)));
    });

  } catch (err) {
    console.error(err);
    const tbody = document.getElementById("tbodyTareas");
    if (tbody) tbody.innerHTML = `<tr><td colspan="6">⚠️ Error al cargar las tareas</td></tr>`;
  }
}

// ----------------------------
// Editar y Eliminar
// ----------------------------
async function editarTarea(id) {
  try {
    const resp = await fetch(`/api/tareas/buscar/${id}`);
    if (!resp.ok) throw new Error("No encontrada");
    const tarea = await resp.json();

    if (tarea.profesorId !== profesorGlobal.id) {
      alert("❌ No puedes editar esta tarea, no es tuya.");
      return;
    }

    // Abre el formulario y precarga datos
    cargarCrearTareas(tarea);
  } catch (err) {
    console.error(err);
    alert("⚠️ No se pudo cargar la tarea para editar");
  }
}

async function eliminarTarea(id) {
  if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;
  try {
    const resp = await fetch(`/api/tareas/eliminar/${id}`, { method: "DELETE" });
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

  // ----------------------------
  // Mapear botones del menú (seguro: si existe el id lo mapeamos)
  // ----------------------------
  function mapMenu() {
    const map = [
      { id: "btn-inicio", fn: () => { tituloSeccion.textContent = "Bienvenido Profesor 👋"; cargarCalendario(); } },
      // tu HTML actual usa "btnCrear-tareas" como botón de tareas -> carga formulario + lista
      { id: "btnCrear-tareas", fn: () => { tituloSeccion.textContent = "Tareas"; cargarCrearTareas(); } },
      // por si cambiaste a "btn-tareas" en algún momento
      { id: "btn-tareas", fn: () => { tituloSeccion.textContent = "Tareas"; cargarCrearTareas(); } },
      { id: "btn-foros", fn: () => { tituloSeccion.textContent = "Foros"; cargarForos(); } },
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
            <li data-id="${c.id}" data-nombre="${c.nombre}" 
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

// Mostrar calificaciones y permitir edición
function verCalificacionesCurso(id_Curso, nombreCurso) {
  const detalleDiv = document.getElementById("detalleCalificaciones");
  detalleDiv.innerHTML = `
    <h2 class="titulo-curso">📘 Calificaciones de ${nombreCurso}</h2>
    <p>Cargando...</p>
  `;

  fetch(`http://localhost:8080/api/entregas/curso/${idCurso}/tareas`)
    .then(res => res.json())
    .then(entregas => {
      if (!entregas || entregas.length === 0) {
        detalleDiv.innerHTML = `
          <h2 class="titulo-curso">📘 Calificaciones de ${nombreCurso}</h2>
          <p>No hay entregas registradas.</p>
        `;
        return;
      }

      let html = `<div class="grid-tareas">`;

      entregas.forEach(e => {
        html += `
          <div class="card-tarea">
            <h3>${e.nombreTarea}</h3>
            <p>Estudiante: <strong>Alumno ${e.idUsuario}</strong></p>
            <p>
              Nota: 
              <input type="number" min="0" max="100" value="${e.calificacion ?? ""}" 
                     id="nota-${e.idEntrega}" style="width:60px; padding:4px; text-align:center;">
            </p>
            <p>Fecha entrega: ${e.fechaEntrega ? new Date(e.fechaEntrega).toLocaleString() : "No registrada"}</p>
            <button class="btn-guardar" data-id="${e.idEntrega}" 
                    style="padding:4px 8px; background:#3b82f6; color:white; border:none; border-radius:6px; cursor:pointer;">
              Guardar Nota
            </button>
          </div>
        `;
      });

      html += `</div>`;
      detalleDiv.innerHTML = `
        <h2 class="titulo-curso">📘 Calificaciones de ${nombreCurso}</h2>
        ${html}
      `;

      // Listeners para actualizar calificaciones
      detalleDiv.querySelectorAll(".btn-guardar").forEach(btn => {
        btn.addEventListener("click", () => {
          const entregaId = btn.dataset.id;
          const nuevaNota = Number(document.getElementById(`nota-${entregaId}`).value);

          fetch(`http://localhost:8080/api/entregas/calificar/${entregaId}?calificacion=${nuevaNota}`, {
            method: "PUT"
          })
          .then(res => {
            if (res.ok) {
              alert("✅ Calificación actualizada");
            } else {
              alert("❌ Error al actualizar la calificación");
            }
          })
          .catch(err => {
            console.error(err);
            alert("⚠️ Error de conexión al actualizar la calificación");
          });
        });
      });
    })
    .catch(err => {
      console.error(err);
      detalleDiv.innerHTML = `<p style="color:red;">❌ Error al cargar calificaciones</p>`;
    });
}





  function cargarForos() { mainContent.innerHTML = "<h1>Foros</h1><p>Sección en construcción...</p>"; }
  function cargarCursos() { mainContent.innerHTML = "<h1>Cursos</h1><p>Sección en construcción...</p>"; }

  // ----------------------------
  // Exponer funciones globales (por si usas onclick inline)
  // ----------------------------
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

    // logout (si existe)
    const logoutBtn = document.getElementById("btn-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("usuarioLogueado");
        window.location.href = "login.html";
      });
    }
  })();

}); // end DOMContentLoaded
