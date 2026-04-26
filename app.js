// Ejecutamos el DOM lo aprendido en clase
document.addEventListener("DOMContentLoaded", function () {
    const objetoCredenciales = {
        nombreUsuario: "admincesde",
        claveUsuario: "12345"
    };

    const cantidadMaximaIntentos = 3;
    let cantidadIntentosFallidos = 0;
    let usuariosGuardados = [];

    // Colocamos los elementos del DOM
    const contenedorLogin = document.getElementById("login");
    const contenedorAplicacion = document.getElementById("app");
    const botonIniciarSesion = document.getElementById("botonLogin");
    const mensajeErrorLogin = document.getElementById("mensajeLogin");
    const botonAgregarUsuario = document.getElementById("botonAgregar");
    const listaDeUsuarios = document.getElementById("listaUsuarios");
    const botonCerrarSesion = document.getElementById("botonSalir");

    //En este paso creamos el LocalStorage para que los datos queden almacenados
    if (localStorage.getItem("usuariosGuardados")) {
        let datos = localStorage.getItem("usuariosGuardados").split(";");
        for (let i = 0; i < datos.length; i++) {
            let partes = datos[i].split(",");
            usuariosGuardados.push({
                nombreUsuario: partes[0],
                rolUsuario: partes[1]
            });
        }
    }

     // Creamos el constructor this, para la clase nombre y rol
    function Usuario(nombreUsuario, rolUsuario) {
        this.nombreUsuario = nombreUsuario;
        this.rolUsuario = rolUsuario;
    }

    // Proceso de ingreso a la página
    botonIniciarSesion.addEventListener("click", function (event) {
        event.preventDefault(); 
        let valorUsuario = document.getElementById("usuario").value;
        let valorClave = document.getElementById("password").value;
        if (
            valorUsuario === objetoCredenciales.nombreUsuario &&
            valorClave === objetoCredenciales.claveUsuario
        ) {
            contenedorLogin.classList.add("oculto");
            contenedorAplicacion.classList.remove("oculto");
            mensajeErrorLogin.textContent = "";
            cantidadIntentosFallidos = 0;
            mostrarListaUsuarios();
        } else {
            cantidadIntentosFallidos++;
            mensajeErrorLogin.textContent = "Datos incorrectos. Intento " + 
            cantidadIntentosFallidos + " de " + cantidadMaximaIntentos;
            if (cantidadIntentosFallidos >= cantidadMaximaIntentos) {
                alert("Cuenta bloqueada");
                botonIniciarSesion.disabled = true;
            }
        }
    });