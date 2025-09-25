document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (e) => {
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;

        if (correo === "" || contrasena === "") {
            e.preventDefault();
            alert("Por favor llena todos los campos.");
        }
    });
});
