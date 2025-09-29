document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // 👈 evitamos que recargue la página

    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    if (correo === "" || contrasena === "") {
      alert("Por favor llena todos los campos.");
      return;
    }

    // 👇 Aquí mandamos la petición al backend
    fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo, contrasena })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Credenciales inválidas");
      }
      return res.json();
    })
    .then(usuario => {
      // Guardamos el usuario en localStorage
      localStorage.setItem("usuario", JSON.stringify(usuario));

      alert("Login exitoso. Bienvenido " + usuario.nombre);
      // 👇 rediriges a la vista de foros
      window.location.href = "foros.html";
    })
    .catch(err => {
      console.error(err);
      alert("Error en el login: " + err.message);
    });
  });
});
