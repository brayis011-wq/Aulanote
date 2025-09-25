document.addEventListener('DOMContentLoaded', function () {
  const mainContent = document.getElementById("main-content");
  const botones = document.querySelectorAll(".menu a");
  const tituloSeccion = document.getElementById("tituloSeccion");
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleSidebar");

  let usuarioId = null; // Variable global para almacenar el ID del usuario


  function marcarActivo(boton) {
    botones.forEach(b => b.classList.remove("selected"));
    boton.classList.add("selected");
  }

 
  // Toggle sidebar
 
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });


  function cargarCalendario() {
    mainContent.innerHTML = `
      <h1 class="bienvenida">Bienvenido Profesor 👋</h1>
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
      }   
    });
    calendar.render();
  }

  function cargarestudiantes() {
    mainContent.innerHTML = "<h1>Estudiantes</h1><p>Sección en construcción...</p>";
  }

  function cargarCalificaciones() {
    mainContent.innerHTML = "<h1>Calificaciones</h1><p>Sección en construcción...</p>";
  }

  function cargarCrearTareas() {
    mainContent.innerHTML = "<h1>Tareas</h1><p>Sección en construcción...</p>";
  }

  function cargarForos() {
    mainContent.innerHTML = "<h1>Foros</h1><p>Sección en construcción...</p>";
  }

  function cargarCursos() {
    mainContent.innerHTML = "<h1>Cursos</h1><p>Sección en construcción...</p>";
  }


  function cargarPerfil() {
    mainContent.innerHTML = "<h1>Perfil</h1><p>Cargando...</p>";
    
    fetch("http://localhost:8080/api/usuario/perfil")
      .then(r => r.json())
      .then(usuario => {
        usuarioId = usuario.id; // ✅ guardamos el id globalmente
        console.log("Usuario ID:", usuarioId);

        mainContent.innerHTML = `
          <div style="max-width:500px; margin:0 auto; background:white; padding:20px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1); text-align:center;">
            <img src="icons/3106807.png" alt="Foto perfil" style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin-bottom:15px;">
            <h2>${usuario.nombre} ${usuario.apellido}</h2>
            <p><strong>Correo:</strong> ${usuario.email}</p>
            <p><strong>Cargo:</strong> ${usuario.cargo}</p>
            <button onclick="alert('Aquí luego implementamos subir foto')">Cambiar foto</button>
          </div>
        `;
      })
      .catch(err => {
        console.error(err);
        mainContent.innerHTML = "<h1>Perfil</h1><p>❌ Error al cargar perfil</p>";
      });
  }


  document.getElementById("btn-inicio").addEventListener("click", e => { 
    e.preventDefault(); 
    marcarActivo(e.target.closest("a")); 
    tituloSeccion.textContent = "Bienvenido Profesor 👋";
    cargarCalendario(); 
  });
  
  document.getElementById("btn-foros").addEventListener("click", e => { 
    e.preventDefault(); 
    marcarActivo(e.target.closest("a")); 
    tituloSeccion.textContent = "📌 Foros";
    cargarForos(); 
  });
  
  document.getElementById("btnCrear-tareas").addEventListener("click", e => { 
    e.preventDefault(); 
    marcarActivo(e.target.closest("a")); 
    tituloSeccion.textContent = "📝 Crear Nueva Tarea";
    cargarCrearTareas(); 
  });
  
  document.getElementById("btn-cursos").addEventListener("click", e => { 
    e.preventDefault(); 
    marcarActivo(e.target.closest("a")); 
    tituloSeccion.textContent = "📘 Cursos";
    cargarCursos(); 
  });
  
  document.getElementById("btn-estudiantes").addEventListener("click", e => { 
    e.preventDefault(); 
    marcarActivo(e.target.closest("a")); 
    tituloSeccion.textContent = "👥 Estudiantes";
    cargarestudiantes(); 
  });
  
  document.getElementById("btn-perfil").addEventListener("click", e => { 
    e.preventDefault(); 
    marcarActivo(e.target.closest("a")); 
    tituloSeccion.textContent = "👤 Perfil";
    cargarPerfil(); 
  });
  
  document.getElementById("btn-calificaciones").addEventListener("click", e => { 
    e.preventDefault(); 
    marcarActivo(e.target.closest("a")); 
    tituloSeccion.textContent = "📊 Calificaciones";
    cargarCalificaciones(); 
  });


  cargarCalendario();
});
//logoutt
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
